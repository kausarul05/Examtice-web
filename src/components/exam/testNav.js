import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const TestNav = (props) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <ul className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
            <li className="active">
                <a href="#">
                    Course : {props.courseName && props.courseName}{" "}
                </a>
            </li>
            <li>
                <a href="#">
                    Subject : {props.subjectName && props.subjectName}
                </a>

                <a className="d-md-none d-lg-none ml-3" href="#" onClick={props.handleEdit}>
                    <i className="fas fa-pen" />
                </a>
            </li>
            <li>
                <a className="d-md-block d-lg-block d-none" href="#" onClick={props.handleEdit}>
                    <i className="fas fa-pen" />
                </a>
            </li>
        </ul>
    )

}

export default TestNav;