import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const hotQuestions = [
  {
    _id: 1,
    title:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae quos?",
  },
  {
    _id: 2,
    title:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae quos?",
  },
  {
    _id: 3,
    title:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae quos?",
  },
  {
    _id: 4,
    title:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae quos?",
  },
  {
    _id: 5,
    title:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae quos?",
  },
];

const popularTags = [
  {
  _id: 1,
  name: 'javascript',
  totlaQuestions: 5
  },
  {
  _id: 2,
  name: 'html',
  totlaQuestions: 5
  },
  {
  _id: 3,
  name: 'css',
  totlaQuestions: 5
  },
  {
  _id: 4,
  name: 'php',
  totlaQuestions: 5
  },
  {
  _id: 5,
  name: 'python',
  totlaQuestions: 5
  },
]
const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-5 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((item) => (
            <Link
              className="flex cursor-pointer items-center justify-between gap-7"
              key={item._id}
              href={`/question/${item._id}`}
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="Chevron Right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16 ">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {
            popularTags.map((tag) => (
                <RenderTag 
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  totalQuestions={tag.totlaQuestions}
                  showCount
                />
            ))
          }    
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
