import React, { useRef, useState } from "react";
import "./Playlist.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import VideoCard from "./VideoCard";

function Playlist({ settriggerFetchVideos, videoList }) {
  const [playlistList, setplaylistList] = useState([]);
  const [addLoading, setaddLoading] = useState(false);
  const inputRef = useRef(null);

  function isValidPlaylistUrl(link) {
    var playlistRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/playlist\?)([a-zA-Z0-9_-]+)/;
    return playlistRegex.test(link);
  }

  async function getPlaylistThumbnail(link) {
    // Extract playlist ID from the link
    const playlistId = getPlaylistIdFromLink(link);

    // Fetch playlist information using YouTube Data API
    const API_KEY = "AIzaSyAYVZH0P5g6g5ltYg3GtNb2ED-V1xg0dsQ";
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
    );
    const data = await response.json();
    // Get the playlist thumbnail URL from the API response
    console.log(data.items[0]?.snippet?.thumbnails?.maxres?.url);
    const thumbnailUrl = data.items[0]?.snippet?.thumbnails?.maxres?.url;
    const thumbnailTitle = data.items[0]?.snippet?.title;
    return { thumbnailUrl, thumbnailTitle };
  }

  // Function to extract playlist ID from the link
  function getPlaylistIdFromLink(link) {
    const match = link.match(/[&?]list=([^&]+)/);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error("Invalid YouTube playlist link");
    }
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

  async function handelAddPlaylist(e) {
    setaddLoading(true);
    e.preventDefault();
    const url = e.target[0].value.trim();
    if (url.trim() != "" && isValidPlaylistUrl(url)) {
      const flag = await isAlreadyPresent(url);
      if (flag) return;
      try {
        const { thumbnailUrl, thumbnailTitle } = await getPlaylistThumbnail(
          url
        );
        const playlistId = getPlaylistIdFromLink(url);
        const obj = {
          videoId: playlistId,
          title: thumbnailTitle,
          thumbnailUrl,
          videoUrl: url,
          updatedAt: Date.now(),
          type: "playlist",
        };
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const currentVideos = userData.videos || [];
        const updatedVideos = [...currentVideos, obj];
        await updateDoc(userDocRef, { videos: updatedVideos });
        settriggerFetchVideos((prev) => !prev);
        inputRef.current.value = "";
        console.log("Document successfully written!");
      } catch (err) {
        console.log(err);
      } finally {
        setaddLoading(false);
      }
    }
  }
  return (
    <>
      <div className="topsection">
        <h2>Track Your Youtube Playlists</h2>
        <form onSubmit={handelAddPlaylist}>
          <input
            type="text"
            placeholder="Paste your youtube playlist link"
            autoComplete="off"
            ref={inputRef}
          />
          <button disabled={addLoading}>{addLoading ? "..." : "Add"}</button>
        </form>
      </div>
      <div className="videoListSection">
        {videoList.map((item, index) => {
          // console.log(item);
          if (item.type == "playlist")
            return (
              <VideoCard
                key={index}
                thumbnailUrl={item.thumbnailUrl}
                videoUrl={item.videoUrl}
                title={item.title}
                settriggerFetchVideos={settriggerFetchVideos}
                isPlaylist={true}
              />
            );
        })}
      </div>
    </>
  );
}

export default Playlist;
