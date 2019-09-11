import React, { FunctionComponent } from "react";

export const DemoMedia: FunctionComponent = () => (
  <div className="embed-responsive embed-responsive-16by9">
    <iframe
      id="youtube-vid"
      className="embed-responsive-item"
      src="https://www.youtube.com/embed/oskddwGpwUw?autoplay=1"
      allowFullScreen
    />
  </div>
);
