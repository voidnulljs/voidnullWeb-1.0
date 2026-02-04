import { useState, useEffect } from 'react';
import axios from 'axios';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;
const MAX_TOTAL_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

export default function Main() {
    const [user, setUser] = useState('');
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user.length > 0 || subject.length > 0 || email.length > 0 || message.length > 0 || files.length > 0) setSuccess(false);
    }, [user, subject, email, message, files]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (selectedFiles.length > MAX_FILES) {
            setErr(`En fazla ${MAX_FILES} dosya yükleyebilirsiniz.`);
            return;
        }

        const oversizeFile = selectedFiles.find(file => file.size > MAX_FILE_SIZE_BYTES);
        if (oversizeFile) {
            setErr(`'${oversizeFile.name}' ${MAX_FILE_SIZE_MB}MB sınırını aşıyor.`);
            return;
        }

        const totalSize = selectedFiles.reduce((size, file) => size + file.size, 0);
        if (totalSize > MAX_TOTAL_SIZE_BYTES) {
            setErr(`Toplam dosya boyutu en fazla ${MAX_TOTAL_SIZE_MB}MB olabilir.`);
            return;
        }

        setFiles(selectedFiles);
        setErr(false);
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setErr(false);
    };

    const sendContact = async () => {
        if (loading) return;
        setLoading(true);
        setErr(false);
        setSuccess(false);

        const formData = new FormData();
        formData.append('username', user);
        formData.append('subject', subject);
        formData.append('email', email);
        formData.append('message', message);
        files.forEach(file => {
            formData.append('files', file);
        });

        const req = await axios.post('/api/contact/new', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).catch(err => err?.response);
        setLoading(false);

        if (!req || !req.data) {
            switch (req?.status ?? 400) {
                case 400:
                    setErr('Fill in all fields and enter a valid email.')
                    break;
                case 405:
                    setErr('Your request has been canceled due to busyness, try again in a few seconds.');
                    break;
                case 429:
                    setErr('You have already submitted a request. Please wait for an hour before trying again.');
                    break;
                case 413:
                    setErr(`Dosya sınırı aşıldı. En fazla ${MAX_FILES} dosya, her biri ${MAX_FILE_SIZE_MB}MB.`);
                    break;
                default:
                    setErr('An unknown error has occurred.');
                    break;
            };
        } else {
            setEmail('');
            setUser('');
            setSubject('');
            setMessage('');
            setFiles([]);
            setSuccess(true);
        };
    };

    return (
        <div className="w-full px-5">
            <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <div className="flex rounded-md border border-white/10 overflow-hidden items-center bg-[#090909]">
                        <div className="h-10 w-10 border-r border-white/10 bg-[#121212] flex items-center justify-center">
                            <i className="fal fa-user text-white" />
                        </div>
                        <input disabled={loading} value={user} onChange={e => setUser(e.target.value)} placeholder="Name" type="text" className="px-3 h-10 bg-transparent w-full text-zinc-300 focus:text-white outline-none transition-all" />
                    </div>
                    <div className="flex rounded-md border border-white/10 overflow-hidden items-center bg-[#090909]">
                        <div className="h-10 w-10 border-r border-white/10 bg-[#121212] flex items-center justify-center">
                            <i className="fa-regular fa-tag text-white" />
                        </div>
                        <input disabled={loading} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" type="subject" className="px-3 h-10 bg-transparent w-full text-zinc-300 focus:text-white outline-none transition-all" />
                    </div>
                    <div className="flex rounded-md border border-white/10 overflow-hidden items-center bg-[#090909]">
                        <div className="h-10 w-10 border-r border-white/10 bg-[#121212] flex items-center justify-center">
                            <i className="fal fa-envelope text-white" />
                        </div>
                        <input disabled={loading} value={email} onChange={e => setEmail(e.target.value)} placeholder="E-Mail" type="email" className="px-3 h-10 bg-transparent w-full text-zinc-300 focus:text-white outline-none transition-all" />
                    </div>
                    <div className="flex rounded-md border border-white/10 overflow-hidden items-center bg-[#090909]">
                        <div className="h-10 w-10 border-r border-white/10 bg-[#121212] flex items-center justify-center">
                            <i className="fal fa-paperclip text-white" />
                        </div>
                        <input disabled={loading} onChange={handleFileChange} type="file" multiple className="px-3 h-10 bg-transparent w-full text-zinc-300 focus:text-white outline-none transition-all pt-1.5" />
                    </div>
                    <p className="text-xs text-zinc-500">
                        Maksimum {MAX_FILES} dosya, her biri en fazla {MAX_FILE_SIZE_MB}MB (Toplam {MAX_TOTAL_SIZE_MB}MB). Seçili: {files.length}/{MAX_FILES}
                    </p>
                    {files.length > 0 && (
                        <div className="text-xs text-zinc-400 space-y-1 bg-[#0f0f0f] border border-white/10 rounded-md p-2">
                            <p>Seçilen dosyalar:</p>
                            <ul className="space-y-1">
                                {files.map((file, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <span className="truncate">
                                            {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(idx)}
                                            className="text-red-400 hover:text-red-300 transition text-[11px] underline"
                                            disabled={loading}
                                        >
                                            Kaldır
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex rounded-md border border-white/10 overflow-hidden items-center bg-[#090909]">
                    <div className="h-full w-10 border-r border-white/10 bg-[#121212] flex items-center justify-center">
                        <i className="fal fa-pencil text-white" />
                    </div>
                    <textarea disabled={loading} value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" className="p-3 resize-none h-full bg-transparent w-full text-zinc-300 focus:text-white outline-none transition-all" />
                </div>
            </div>
            <div className="w-full max-w-screen-lg mx-auto space-x-5 flex items-center mt-5 justify-end">
                {err && <h1 className="text-red-500 italic"><i className="fas fa-circle-x mr-1" /> {err}</h1>}
                {success && <h1 className="text-green-500 italic"><i className="fas fa-circle-check mr-1" /> Yey, your contact form has been sent successfully.</h1>}
                <a onClick={sendContact} className="w-auto flex items-center justify-center shadow-lg gap-x-2 shadow-yellow-600/20 rounded-xl py-2.5 font-medium px-7 bg-gradient-to-tl from-yellow-500 to-yellow-700 text-white  hover:opacity-80 transition duration-200 cursor-pointer" style={{ opacity: loading ? 0.5 : 1 }}>
                    Send <i className="ml-1 fa-solid fa-ticket" />
                </a>
            </div>
        </div>
    );
};
