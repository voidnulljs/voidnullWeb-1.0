import Hero from '../components/Index/Hero.jsx';
import Techs from '../components/Index/Techs.jsx';
import Repos from '../components/Index/Repos.jsx';
import Head from 'next/head';

export default function Index() {
    return (
        <>
            <Head>
                <title>Home | voidnull</title>
            </Head>
            <Hero />
            <Repos />
            <Techs />
        </>
    );
};
