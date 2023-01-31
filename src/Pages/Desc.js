import React, { useState } from "react";

/**
 * @author
 * @function Desc
 **/

const Youtube = (props) => {
  const [text, setText] = useState("");
  return (
    <div
      onChange={(e) => {
        console.log(e.target.value);
      }}
    >
      {/* <button
          className="bg-blue-600 text-white p-2 mt-8 rounded-md"
          disabled
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
        >
          Copy
        </button> */}
      <h1 className="mt-8">
        【流堂崇拜】{props.title} | {props.verse} | {props.year}
        {props.month}
        {props.day}
      </h1>
      <p>【點擊連結網上參與：{props.link} 】</p>
      <br />
      <p>
        🗓 網上崇拜點樣參與好呢？ <br />
        1. 這是崇拜，一齊敬拜，由頭參與到尾。 <br />
        2. 搵一個可以專心嘅場地 <br />
        3. 或者帶個headphone <br />
        4. 盡量唔好理訊息通知啦 <br />
        5. 歡迎㩒like㩒心㩒笑，最好share畀朋友 <br />
        6. 歡迎將你的祈禱打在留言 <br />
        7. 嚴禁不恰當、人身攻擊、廣告及惡意洗版留言。
        請大家謹記耶穌的教訓，學習尊重別人，注意言詞，以禮相待。多謝合作。{" "}
      </p>
      <br />.
      <p>
        🌊{props.year}
        {props.month}
        {props.day} 流堂崇拜 <br />
        月題：看見 <br />
        講題：{props.title} <br />
        經文：{props.verse} <br />
        日期：{props.year}年{props.month}月{props.day}日(六) <br />
        時間：8:00pm ⚠️ <br />
        地點：九龍尖沙咀柯士甸路 22-26A號 好兆年行一樓
        <br />
        (同步Youtube直播，網上參與)
      </p>
      <p>
        ⚠️崇拜現不再需要報名，歡迎各位自由Walk-In參與崇拜。座位有限，記得早到。{" "}
        <br />
        <br /> ========== ========== ==========
        <br />
        【加入流堂群體】如果你已經離開教會一段時間，想重新投入教會群體生活，歡迎填寫以下回應表，讓flow
        church知道你的意願。
        <br />
        https://www.flowchurchhk.com/get-connected <br />.<br /> 【流堂連結
        連結流堂】https://linktr.ee/flowchurchhk <br />→ #崇拜聚會 <br />→
        #講道回顧 <br />→ #流堂媒體 <br />→ #聲音節目
        <br />→ #資訊群組 <br />→ #保持聯絡 <br />
        #flowchurch #流堂
      </p>
    </div>
  );
};

export const Desc = (props) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("上帝視角");
  const [verse, setVerse] = useState("申命記34章");
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState("01");
  const [day, setDay] = useState("14");
  const [link, setLink] = useState("");
  return (
    <div className="App m-12">
      <h1 className="font-bold text-4xl mb-8">我唔會再打錯 Description</h1>
      <a
        href="https://drive.google.com/drive/folders/1jfp-DfO8Dw3DsNfScjE6ajLNk57OeJzZ"
        target="_blank"
        className="text-blue-600 underline"
      >
        🗂️2023 flow church worship (CURRENT) folder{" "}
      </a>
      <br />
      <a
        href="https://drive.google.com/drive/folders/1XsDwR-H6m6Zl4sz9TMdYqqWJIv9iti85"
        target="_blank"
        className="text-blue-600 underline"
      >
        🎯崇拜報告常用圖{" "}
      </a>
      <div className="flex-col mt-8">
        <ul className="flex-1 text-left">
          <li className="p-2">
            <label>
              title:
              <input
                onChange={(e) => setTitle(e.target.value)}
                className="border-b-2 border-gray-200 mx-2 bg-transparent focus:border-teal-400"
              />
            </label>
          </li>
          <li className="p-2">
            <label>
              verse:
              <input
                onChange={(e) => setVerse(e.target.value)}
                className="border-b-2 border-gray-200 mx-2 bg-transparent focus:border-teal-400"
              />
            </label>
          </li>
          <li className="p-2">
            <label>
              date:
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-12 border-b-2 border-gray-200 mx-2 bg-transparent focus:border-teal-400"
              />
              <input
                onChange={(e) => setMonth(e.target.value)}
                className="w-12 border-b-2 border-gray-200 mx-2 bg-transparent focus:border-teal-400"
              />
              <input
                onChange={(e) => setDay(e.target.value)}
                className="w-12 border-b-2 border-gray-200 mx-2 bg-transparent focus:border-teal-400"
              />
            </label>
          </li>
          <li className="p-2">
            <label>
              link:
              <input
                onChange={(e) => setLink(e.target.value)}
                className="border-b-2 border-gray-200 mx-2 bg-transparent focus:border-teal-400"
              />
            </label>
          </li>
        </ul>

        <div className="text-left">
          {title && (
            <Youtube
              onChange={(e) => {
                setText(e.target.value);
              }}
              title={title}
              verse={verse}
              year={2023}
              month={month}
              day={day}
              link={link}
            />
          )}
        </div>
      </div>
    </div>
  );
};
