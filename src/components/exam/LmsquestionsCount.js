import React, { useEffect } from "react";
import { getIsExam } from "../../features/userSlice";
import { useSelector } from "react-redux";

const LmsquestionsCount = (props) => {
    const isExam = useSelector(getIsExam);

    return (
        <>
            <ul>
                {props.questions.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => props.jumpOnQuestion(index)}
                        className={`${item.isAttempt
                                ? "exam"
                                : ""
                            } pointer`}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                            {index + 1}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};
export default LmsquestionsCount;
