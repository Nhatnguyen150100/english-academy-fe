import React from 'react';
import { IKanji } from '../../types/kanji.types';
import { Divider } from 'antd';

interface IProps {
  kanji: IKanji;
  onClick: (kanji: IKanji) => void;
}

export default function BaseDisplayKanji({ kanji, onClick }: IProps) {
  return (
    <div
      onClick={() => onClick(kanji)}
      className="p-5 border-solid border-[1px] rounded-xl shadow-xl flex flex-row justify-start item-center min-h-40 w-[380px] transform-hover hover:cursor-pointer hover:border-blue-600 hover:border-2"
    >
      <span className="text-6xl flex items-center">{kanji.character}</span>
      <Divider
        className="h-[100px] ms-5 flex items-center justify-center"
        style={{ borderInlineStart: '2px solid rgba(5, 5, 5, 0.06)' }}
        plain
        variant="solid"
        type="vertical"
      />
      <div className="ms-3 flex flex-col justify-start items-start">
        <span className="font-semibold text-md">
          Meaning: <span className="font-normal text-sm">{kanji.meaning}</span>
        </span>
        <span className="font-semibold text-md">
          Kanji radicals:{' '}
          <span className="font-normal text-sm">{kanji.chinaMeaning}</span>
        </span>
        <span className="font-semibold text-md">
          Mnemonic:
          <span className="font-normal text-sm ms-1">{kanji.mnemonic}</span>
        </span>
        <span className="font-semibold text-md">
          Kunyomi:
          <span className="font-normal text-sm ms-1">{kanji.kunReading}</span>
        </span>
        <span className="font-semibold text-md">
          Onyomi:
          <span className="font-normal text-sm ms-1">{kanji.onReading}</span>
        </span>
      </div>
    </div>
  );
}
