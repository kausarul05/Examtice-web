import React, { useEffect, useState } from "react";
import { getIsExam } from "../../features/userSlice";
import { useSelector } from "react-redux";

const QuestionCount = (props) => {

    // console.log(props)

    const isExam = useSelector(getIsExam);
    const itemsPerPageDesktop = 50;
    const itemsPerPageMobile = 5;

    const calculateItemsPerPage = () => {
        return window.innerWidth >= 576 ? itemsPerPageDesktop : itemsPerPageMobile;
    };

    // Use state to store the itemsPerPage value
    const [itemsPerPage, setItemsPerPage] = useState(calculateItemsPerPage());

    const currentPage = Math.ceil(props.step / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    const showNextButton = props.questions.length > endIndex;
    const showPreviousButton = currentPage > 1;

    const handleNextClick = () => {
        if (props.step < props.questions.length) {
            props.setStep((prevStep) => prevStep + 1);
        }
    };
    
    const handlePreviousClick = () => {
        if (props.step > 1) {
            props.setStep((prevStep) => prevStep - 1);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            // Calculate the new itemsPerPage when the window is resized
            setItemsPerPage(calculateItemsPerPage());
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, [])

    return (
        <>
            <div className="d-block">
                <ul className="d-block">
                    <li
                        className="d-block d-md-none d-lg-none"
                        onClick={handlePreviousClick}
                        style={{ backgroundColor: "#cd2067"}}>
                        <span style={{fontSize: "20px"}}>Pre</span>
                    </li>
                    {props.questions.slice(startIndex, endIndex).map((item, index) => (
                        <li
                            key={index + startIndex}
                            onClick={() => props.jumpOnQuestion(index + startIndex)}
                            className={`${!isExam
                                ? item.isCorrect === undefined
                                    ? ""
                                    : item.isCorrect
                                        ? "green"
                                        : "red"
                                : item.isAttempt
                                    ? "exam"
                                    : ""
                                } pointer ${(index + 1) + startIndex === props.step ? "selected" : ""}`}
                        >
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                {index + 1 + startIndex}
                            </a>
                        </li>
                    ))}
                    <li
                        className="d-block d-md-none d-lg-none"
                        onClick={handleNextClick}
                        style={{ backgroundColor: "#cd2067" }}>
                        <span style={{fontSize: "20px"}}>Next</span>
                    </li>
                </ul>
            </div>



            <div className="row w-100 m-0 ">
                <div className="col-12 d-none d-md-block d-lg-block">
                    <div className="question-move-next-and-previous">
                        <button
                            className="question-move-btn"
                            onClick={handlePreviousClick}
                        >
                            Pre
                        </button>

                        <button
                            className="question-move-btn"
                            onClick={handleNextClick}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionCount;







