import React, { useContext, useState } from "react";
import { Button, CheckBlock, Input } from "../Componenets/Components";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function CreateUser
 **/

export const CreateUser = (props) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [nickname, setNickname] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [lead, setLead] = useState(false);
  const [vocal, setVocal] = useState(false);
  const [piano, setPiano] = useState(false);
  const [drum, setDrum] = useState(false);
  const [bass, setBass] = useState(false);
  const [acousticGuitar, setAcousticGuitar] = useState(false);
  const [elecGuitar, setElecGuitar] = useState(false);
  const [violin, setViolin] = useState(false);
  const [propre, setPropre] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [camMan, setCamMan] = useState(false);
  const [audio, setAudio] = useState(false);
  const [lighting, setLighting] = useState(false);
  const [chef, setChef] = useState(false);
  const [specialAgent, setSpecialAgent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        uid: user.id,
        nickname,
        phoneNumber,
        lead,
        vocal,
        piano,
        drum,
        bass,
        acousticGuitar,
        elecGuitar,
        violin,
        propre,
        streaming,
        camMan,
        audio,
        lighting,
        chef,
        specialAgent,
      })
      .select();

    if (data) {
      console.log(data);
    }

    if (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <form
            onSubmit={submitHandler}
            className="flex flex-col md:w-1/3 w-full m-auto gap-2"
          >
            <Input
              placeholder="平時啲人點叫你？"
              onChange={(e) => {
                setNickname(e.target.value);
              }}
              required={true}
            />
            <Input
              placeholder="電話號碼"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required={true}
            />
            <div className="text-left">
              <h3 className="ml-2 mb-2 mt-4">你有乜嘢 Skills? </h3>
              <CheckBlock
                label="🎤 主領"
                element={lead}
                onClick={(e) => {
                  e.preventDefault();
                  setLead(!lead);
                }}
              />
              <CheckBlock
                label="🎤 和唱"
                element={vocal}
                onClick={(e) => {
                  e.preventDefault();
                  setVocal(!vocal);
                }}
              />
              <CheckBlock
                label="🎹 琴"
                element={piano}
                onClick={(e) => {
                  e.preventDefault();
                  setPiano(!piano);
                }}
              />
              <CheckBlock
                label="🥁 鼓"
                element={drum}
                onClick={(e) => {
                  e.preventDefault();
                  setDrum(!drum);
                }}
              />
              <CheckBlock
                label="🎸 bass"
                element={bass}
                onClick={(e) => {
                  e.preventDefault();
                  setBass(!bass);
                }}
              />
              <CheckBlock
                label="🎸 電結"
                element={elecGuitar}
                onClick={(e) => {
                  e.preventDefault();
                  setElecGuitar(!elecGuitar);
                }}
              />
              <CheckBlock
                label="🎸 木結"
                element={acousticGuitar}
                onClick={(e) => {
                  e.preventDefault();
                  setAcousticGuitar(!acousticGuitar);
                }}
              />
              <CheckBlock
                label="🎻 小提琴"
                element={violin}
                onClick={(e) => {
                  e.preventDefault();
                  setViolin(!violin);
                }}
              />
              <CheckBlock
                label="📽 propre"
                element={propre}
                onClick={(e) => {
                  e.preventDefault();
                  setPropre(!propre);
                }}
              />
              <CheckBlock
                label="📡 直播"
                element={streaming}
                onClick={(e) => {
                  e.preventDefault();
                  setStreaming(!streaming);
                }}
              />
              <CheckBlock
                label="📹 Carman"
                element={camMan}
                onClick={(e) => {
                  e.preventDefault();
                  setCamMan(!camMan);
                }}
              />
              <CheckBlock
                label="🎛 音響"
                element={audio}
                onClick={(e) => {
                  e.preventDefault();
                  setAudio(!audio);
                }}
              />
              <CheckBlock
                label="🌈 燈光"
                element={lighting}
                onClick={(e) => {
                  e.preventDefault();
                  setLighting(!lighting);
                }}
              />
              <CheckBlock
                label="🧑‍🍳 膳長"
                element={chef}
                onClick={(e) => {
                  e.preventDefault();
                  setChef(!chef);
                }}
              />
              <CheckBlock
                label="🥷 特務"
                element={specialAgent}
                onClick={(e) => {
                  e.preventDefault();
                  setSpecialAgent(!specialAgent);
                }}
              />
            </div>
            <Button onClick={submitHandler}>Submit</Button>
          </form>
        </div>
      ) : (
        "Not Authenticated"
      )}
    </div>
  );
};
