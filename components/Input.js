import { useRef, useState } from "react";
import {
  HiOutlinePhotograph,
  HiOutlineChartBar,
  HiOutlineEmojiHappy,
  HiOutlineCalendar,
} from "react-icons/hi";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { GrFormClose } from "react-icons/gr";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
function Input() {
  const [input, setinput] = useState();
  const [selectedfile, setselectedfile] = useState(null);
  const [loading, setloading] = useState(false);
  const filepickerref = useRef(null);
  const [showemojis, setShowemojis] = useState(false);
  const { data: session } = useSession();
  console.log(session);
  const addimagetopost = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setselectedfile(readerEvent.target.result);
    };
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setinput(input + emoji);
  };
  const sendpost = async () => {
    if (loading) return;
    setloading(true);

    const docref = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });
    const imageref = ref(storage, `posts/${docref.id}/image`);
    if (selectedfile) {
      await uploadString(imageref, selectedfile, "data_url").then(async () => {
        const downloadurl = await getDownloadURL(imageref);
        await updateDoc(doc(db, "posts", docref.id), {
          image: downloadurl,
        });
      });
    }
    setloading(false);
    setinput("");
    setselectedfile(null);
    setShowemojis(false);
  };
  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll  scrollbar-hide ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={session.user?.image}
        alt="one"
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="divide-y divide-gray-700 w-full">
        <div className={`${selectedfile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => setinput(e.target.value)}
            placeholder="What's happening?"
            rows="2"
            className="bg-transparent outline-none text-[#d9d9d9] text-lg
             placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          />

          {selectedfile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75
                 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => setselectedfile(null)}
              >
                <GrFormClose className="text-white h-5" />
              </div>
              <img
                src={selectedfile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filepickerref.current.click()}
              >
                <HiOutlinePhotograph className="text-[#1d9bf0] h-[22px]" />
                <input
                  type="file"
                  ref={filepickerref}
                  hidden
                  onChange={addimagetopost}
                />
              </div>

              <div className="icon rotate-90">
                <HiOutlineChartBar className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon" onClick={() => setShowemojis(!showemojis)}>
                <HiOutlineEmojiHappy className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon">
                <HiOutlineCalendar className="text-[#1d9bf0] h-[22px]" />
              </div>

              {showemojis && (
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  //onClickOutside={()=>setShowemojis(!showemojis)}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: -40,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold 
              shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 
              disabled:cursor-default"
              disabled={!input && !selectedfile}
              onClick={sendpost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
