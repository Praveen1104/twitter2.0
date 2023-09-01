import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "@/components/Login";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalatom";
import Modal from "@/components/Modal";
import Widget from "@/components/Widget";
import { trendingresults } from "../helpers/Static";
import { followresults } from "../helpers/Static";

export default function Home({ providers }) {
  const { data: session } = useSession();
  const [isopen, setisopen] = useRecoilState(modalState);
  if (!session) return <Login providers={providers} />;
  return (
    <div className="overflow-y-scroll scrollbar-hide">
      <Head>
        <title>Twitter2.0</title>
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widget
          trendingresults={trendingresults}
          followresults={followresults}
        />
        {isopen && <Modal />}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  /* const trendingresults = await fetch("https://www.jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followresults = await fetch("https://www.jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  ); */
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      //trendingresults,
      //followresults,
      providers,
      session,
    },
  };
}
