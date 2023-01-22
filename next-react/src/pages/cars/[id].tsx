import { Car as CarType } from "@/types/cars";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Car({ car }: { car: CarType }) {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head>
                <title>{car.color} {car.id}</title>
            </Head>
            <h1 className="title">Hello {id}</h1>
            <picture>
                <img src={car.image} width="300" alt={car.id} />
            </picture>
        </>
    )
}

// Use SSR alternatively
// export async function getServerSideProps({params}: {params: {id: string } }) {
//     const req = await fetch(`http://localhost:3000/${params.id}.json`);
//     const data = await req.json() as CarType;

//     return {
//         props: {
//             car: data
//         }
//     }
// }

export async function getStaticProps({ params }: { params: { id: string } }) {
    const req = await fetch(`http://localhost:3000/${params.id}.json`);
    const data = await req.json() as CarType;

    return {
        props: {
            car: data
        }
    }
}

// Provide a list of possible values for id for SSG
export async function getStaticPaths() {
    const req = await fetch(`http://localhost:3000/cars.json`);
    const data = await req.json() as string[];

    const paths = data.map((id) => ({
        params: { id }
    }));

    return {
        paths,
        fallback: false
    }
}
