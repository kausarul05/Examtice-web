import Cookies from "js-cookie";
import React, { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const Statistics = ({ stats, type }) => {

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">My Statistics</th>
            <th scope="col">All users statistics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Appeared in tests :</td>
            <td>{stats?.userAppearedTest != undefined ? stats?.userAppearedTest : 0}x</td>
            <td>{stats?.allAppearedTest}x</td>
          </tr>

          {(() => {
            if (type == 1) {
              return <tr>
                <td>Answered correctly in :</td>
                <td>
                  {stats?.userAnsweredCorrect != undefined ? (
                    <>
                      {Math.floor(
                        (stats.userAnsweredCorrect / stats?.userAppearedTest) * 100
                      )}
                    </>
                  ) : (
                    0
                  )}
                  %
                </td>
                <td>
                  {stats?.allAnsweredCorrect != undefined ? (
                    <>
                      {Math.floor(
                        (stats.allAnsweredCorrect / stats?.allAppearedTest) * 100
                      )}
                    </>
                  ) : (
                    0
                  )}
                  %
                </td>
              </tr>
            }
          })()}
        </tbody>
      </table>
    </>
  );
};
export default Statistics;
