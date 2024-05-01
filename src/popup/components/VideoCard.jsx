import React from "react";
import "./VideoCard.css";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function VideoCard({
  thumbnailUrl,
  videoUrl,
  title,
  settriggerFetchVideos,
  isPlaylist,
}) {
  function handelContinue() {
    window.open(videoUrl, "_blank");
  }
  async function handelRemove() {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();
    const currentVideos = userData.videos || [];
    const updatedVideos = currentVideos.filter(
      (obj) => obj.videoUrl !== videoUrl
    );
    await updateDoc(userDocRef, { videos: updatedVideos });
    settriggerFetchVideos((prev) => !prev);
  }
  return (
    <div className="videoCardContainer">
      {isPlaylist ? (
        <div className="thumbnailContainer">
          <img src={thumbnailUrl} className="" />
          <img src={thumbnailUrl} className="imgPlaylist" />
          <img src={thumbnailUrl} className="imgPlaylist1" />
        </div>
      ) : (
        <img src={thumbnailUrl} />
      )}
      <div className="videoTitle">
        {isPlaylist ? (
          <h4 style={{ marginLeft: "10px" }}>{title}</h4>
        ) : (
          <h4>{title}</h4>
        )}
      </div>
      <div className="videoBtnCont">
        <button className="continueBtn" onClick={handelContinue}>
          Continue
        </button>
        <button className="removeBtn" onClick={handelRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default VideoCard;
