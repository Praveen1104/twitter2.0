import { modalState } from "@/atoms/modalatom";
import Login from "@/components/Login";
import Modal from "@/components/Modal";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import { db } from "@/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { BsArrowLeftShort } from "react-icons/bs";
import Comment from "@/components/Comment";
import Widget from "@/components/Widget";
function Postpage({ trendingresults, followresults, providers }) {
  const { data: session } = useSession();
  const [isopen, setisopen] = useRecoilState(modalState);
  const [post, setpost] = useState();
  const [comments, setcomments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    onSnapshot(doc(db, "posts", id), (snapshot) => {
      setpost(snapshot.data());
    });
  }, [db]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setcomments(snapshot.docs)
    );
  }, [db, id]);

  if (!session) return <Login providers={providers} />;
  return (
    <div className="">
      <Head>
        <title>
          {post?.username} on Twitter: "{post?.text}"
        </title>
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div
            className="flex items-center px-1.5 py-2 border-b border-gray-700
           text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black"
          >
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <BsArrowLeftShort className="h-5 text-white" />
            </div>
            Tweet
          </div>
          <Post id={id} post={post} postpage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widget
          trendingresults={trendingresults}
          followresults={followresults}
        />
        {isopen && <Modal />}
      </main>
    </div>
  );
}

export default Postpage;

export async function getServerSideProps(context) {
  const trendingresults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followresults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );

  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingresults,
      followresults,
      providers,
      session,
    },
  };
}
