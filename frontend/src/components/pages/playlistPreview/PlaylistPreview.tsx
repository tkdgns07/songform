'use client';
import { useState, useEffect } from 'react';

const PlaylistPreview = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center relative overflow-hidden">
      <div className="w-[1000px] h-[500px] rounded-md border-2 border-cusblue-light shadow-2xl shadow-cusblue-light z-10 playlist"></div>
      <div className="gradient-circle absolute top-1/2 right-1/2 -z-10"></div>
    </div>
  );
};

export default PlaylistPreview;
