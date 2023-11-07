"use client";
import { DeleteAnswer } from "@/lib/actions/answer.actions";
import { DeleteQuestion } from "@/lib/actions/question.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      // Delete Question
      await DeleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === "Answer") {
      // Delete Answer
      await DeleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain "
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain "
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
