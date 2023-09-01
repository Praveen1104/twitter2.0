import Image from "next/image";
import image1 from "../public/images/twitter-icon.jpg";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { BiHash, BiDotsHorizontalRounded } from "react-icons/bi";
import { BsBell, BsBookmark } from "react-icons/bs";
import { MdOutlineInbox } from "react-icons/md";
import {
  HiOutlineClipboardList,
  HiOutlineDotsCircleHorizontal,
} from "react-icons/hi";
import Sidebarlink from "./Sidebarlink";
import { signOut, useSession } from "next-auth/react";
function Sidebar() {
  const { data: session } = useSession();
  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image src={image1} alt="one" width={30} height={30} />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <Sidebarlink text="Home" Icon={AiFillHome} active />
        <Sidebarlink text="Explore" Icon={BiHash} />
        <Sidebarlink text="Notifications" Icon={BsBell} />
        <Sidebarlink text="Messages" Icon={MdOutlineInbox} />
        <Sidebarlink text="Bookmarks" Icon={BsBookmark} />
        <Sidebarlink text="Lists" Icon={HiOutlineClipboardList} />
        <Sidebarlink text="Profile" Icon={AiOutlineUser} />
        <Sidebarlink text="More" Icon={HiOutlineDotsCircleHorizontal} />
      </div>
      <button
        className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56
       h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]"
      >
        Tweet
      </button>
      <div
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation
       xl:ml-auto xl:-mr-5"
        onClick={signOut}
      >
        <img
          src={session.user?.image}
          alt="one"
          className="h-10 w-10 rounded-full xl:mr-2.5"
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{session?.user.name}</h4>
          <p className="text-[#6e767d]">@{session?.user.tag}</p>
        </div>
        <BiDotsHorizontalRounded className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
}

export default Sidebar;
