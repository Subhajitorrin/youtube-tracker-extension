import React from "react";

function PlaylistCard() {
  return (
    <div className="videoCardContainer">
      <img src={thumbnailUrl} />
      <div className="videoTitle">
        <h4>{title}</h4>
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

export default PlaylistCard;
