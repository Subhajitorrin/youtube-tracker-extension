import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import VideoCard from "./VideoCard";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Playlist from "./Playlist";
import MiniLoading from "./MiniLoading";

function Home() {
  const [videosLoading, setVideosLoading] = useState("");
  const [videoList, setvideoList] = useState([]);
  const [triggerFetchVideos, settriggerFetchVideos] = useState(false);
  const [isPlaylist, setisPlaylist] = useState(false);
  const [addLoading, setaddLoading] = useState(false);
  const [skeleton, setskeleton] = useState(["", "", "", "", ""]);
  const inputRef = useRef(null);

  function getYoutubeThumbnail(url) {
    var videoID = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )[1];
    var thumbnailUrl =
      "https://img.youtube.com/vi/" + videoID + "/maxresdefault.jpg";
    return thumbnailUrl;
  }

  function isValidYouTubeUrl(url) {
    const youtubeRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  }

  async function isAlreadyPresent(url) {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const currentVideos = userData.videos || [];
      // console.log(currentVideos);
      for (const obj of currentVideos) {
        if (obj.videoUrl === url) {
          return true;
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function getVideoTitle(videoUrl) {
    const videoId = getYouTubeVideoId(videoUrl);
    const APIKEY = "AIzaSyAYVZH0P5g6g5ltYg3GtNb2ED-V1xg0dsQ";
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${APIKEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch video data from YouTube API");
    }
    const data = await response.json();
    const title = data.items[0]?.snippet?.title;
    return title;
  }

  function getYouTubeVideoId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    } else {
      throw new Error("Invalid YouTube URL");
    }
  }

  async function handelAddVideo(e) {
    e.preventDefault();
    setaddLoading(true);
    const url = e.target[0].value.trim();
    if (url.trim() != "" && isValidYouTubeUrl(url)) {
      const flag = await isAlreadyPresent(url);
      if (flag) return;
      const thumbnailUrl = getYoutubeThumbnail(url);
      const videoUrl = url;
      const userUid = auth.currentUser.uid;
      const title = await getVideoTitle(url);
      const videoId = getYouTubeVideoId(url);
      const obj = {
        videoId,
        title,
        thumbnailUrl,
        videoUrl,
        updatedAt: Date.now(),
        type: "video",
      };
      try {
        const userDocRef = doc(db, "users", userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const currentVideos = userData.videos || [];
        const updatedVideos = [...currentVideos, obj];
        await updateDoc(userDocRef, { videos: updatedVideos });
        settriggerFetchVideos((prev) => !prev);
        inputRef.current.value = "";
        console.log("Document successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      } finally {
        setaddLoading(false);
      }
    } else {
      console.log("not valid");
    }
  }

  useEffect(() => {
    async function fetchVideos() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setvideoList(docSnap.data().videos);
    }
    fetchVideos();
  }, [triggerFetchVideos]);

  return (
    <div className="homeContainer">
      <button className="signoutBtn" onClick={() => signOut(auth)}>
        Sign out
      </button>
      <button className="vdoBtn" onClick={() => setisPlaylist((prev) => !prev)}>
        {isPlaylist ? "Vidoes" : "Playlists"}
      </button>
      {isPlaylist ? (
        <Playlist
          settriggerFetchVideos={settriggerFetchVideos}
          videoList={videoList}
        />
      ) : (
        <>
          <div className="topsection">
            <h2>Track Your Youtube Video</h2>
            <form onSubmit={handelAddVideo}>
              <input
                type="text"
                placeholder="Paste your video link"
                autoComplete="off"
                ref={inputRef}
              />
              <button disabled={addLoading}>
                {addLoading ? "..." : "Add"}
              </button>
            </form>
          </div>
          <div className="videoListSection">
            {videoList.map((item, index) => {
              // console.log(item);
              if (item.type === "video") {
                return (
                  <VideoCard
                    key={index}
                    thumbnailUrl={item.thumbnailUrl}
                    videoUrl={item.videoUrl}
                    title={item.title}
                    settriggerFetchVideos={settriggerFetchVideos}
                  />
                );
              } else {
                return null;
              }
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
