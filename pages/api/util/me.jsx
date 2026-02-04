export default async function Me(req, res) {
    try {
        const profile = {
            name: 'voidnull',
            title: 'Full-Stack Developer',
            location: 'Turkey',
            contact: {
                github: 'https://github.com/voidnulljs',
                discord: 'https://discord.com/users/619841555255132160'
            }
        };

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).end();
    }
}


