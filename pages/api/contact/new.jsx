import siteConfig from '../../../website.config';
import isEmail from 'validator/lib/isEmail';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 25 * 1024 * 1024;

let last_contact = 0;
const emailRequestTimes = {};

export default async function Contact(req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end();

        const form = formidable({
            multiples: true,
            maxFiles: MAX_FILES,
            maxFileSize: MAX_FILE_SIZE,
            maxTotalFileSize: MAX_TOTAL_FILE_SIZE,
        });

        let fields;
        let files;
        try {
            [fields, files] = await form.parse(req);
        } catch (formErr) {
            const status = formErr?.httpCode ?? 400;
            if (status === 413) return res.status(413).json({ error: 'File upload limit exceeded.' });
            return res.status(status).json({ error: 'Invalid form data.' });
        }

        const username = fields.username?.[0];
        const subject = fields.subject?.[0];
        const email = fields.email?.[0];
        const message = fields.message?.[0];

        if (!username || !subject || !email || !message || !isEmail(email)) return res.status(400).end();

        const uploadedFiles = files?.files ? (Array.isArray(files.files) ? files.files : [files.files]) : [];

        const exceedsLimits =
            uploadedFiles.length > MAX_FILES ||
            uploadedFiles.some(file => file.size > MAX_FILE_SIZE) ||
            uploadedFiles.reduce((size, file) => size + file.size, 0) > MAX_TOTAL_FILE_SIZE;

        if (exceedsLimits) {
            return res.status(413).json({ error: 'File upload limit exceeded.' });
        }

        const currentTime = Date.now();

        if (emailRequestTimes[email] && (currentTime - emailRequestTimes[email]) < 3600000) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }

        const embed = {
            title: 'Contact',
            color: 0xffed00,
            fields: [
                { name: '**Date**', value: '```' + (new Date().toLocaleString()) + '```', inline: true },
                { name: '**Username**', value: '```' + username + '```', inline: true },
                { name: '**Subject**', value: '```' + subject + '```', inline: true },
                { name: '**E-Mail**', value: '```' + email + '```', inline: true },
                { name: '**Message**', value: '```' + message.slice(0, 1024) + '```', inline: false },
                { name: '**Contact Message Title**', value: '```' + "[voidnull Contact] " + subject + '```', inline: false }
            ]
        };

        const payload = {
            username: 'voidnull',
            embeds: [embed]
        };

        const cleanupFiles = () => {
            uploadedFiles.forEach(file => {
                fs.unlink(file.filepath, () => { });
            });
        };

        try {
            if (uploadedFiles.length) {
                const formData = new FormData();
                formData.append('payload_json', JSON.stringify(payload));

                uploadedFiles.forEach((file, index) => {
                    const fileBuffer = fs.readFileSync(file.filepath);
                    const blob = new Blob([fileBuffer]);
                    formData.append(`files[${index}]`, blob, file.originalFilename);
                });

                await fetch(siteConfig.webhook_url, {
                    method: 'POST',
                    body: formData
                });
            } else {
                await fetch(siteConfig.webhook_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }

            last_contact = currentTime;
            emailRequestTimes[email] = currentTime;

            res.json(true);
        } catch (error) {
            console.error(error);
            res.status(500).end();
        } finally {
            cleanupFiles();
        }
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
};
