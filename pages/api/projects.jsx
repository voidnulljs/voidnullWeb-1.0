export default async function Projects(req, res) {
    const data = [
        {
            "image": "/img/projects/dnschanger_image.png",
            "logo": "/img/projects/dnschanger_logo.png",
            "title": "DNSChanger",
            "text": "Change your DNS addresses, increase your internet speed and protect your privacy with DNS Changer!",
            "link": "https://dnschanger.vercel.app/"
        },
        {
            "image": "/img/projects/woowly_image.png",
            "logo": "/img/projects/woowly_logo.png",
            "title": "Woowly Music",
            "text": "Discover the universality and quality of music with Woowly Music!",
            "link": "https://woowly.vercel.app/"
        },
        {
            "image": "",
            "logo": "",
            "title": "Password Generator Web",
            "text": "You can't find yourself a strong password, create it from this site!",
            "link": "https://passwordgeneratorweb.vercel.app/"
        }
    ];
    res.status(200).json(data);
};
