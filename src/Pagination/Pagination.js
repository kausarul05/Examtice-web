import React, { useState, useEffect } from 'react';

const Pagination = ({ postsPerpage, totalPosts, paginate, currentPage, setCurrentPage }) => {
    const [pageGroup, setPageGroup] = useState(0);
    const [maxPageNumbersToShow, setMaxPageNumbersToShow] = useState(10); // default for larger screens
    const nPage = Math.ceil(totalPosts / postsPerpage);

    // Adjust the number of pages shown based on screen width
    useEffect(() => {
        const handleResize = () => {
            setMaxPageNumbersToShow(window.innerWidth <= 768 ? 5 : 10);
        };

        // Initial setting and event listener for window resize
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const startPage = pageGroup * maxPageNumbersToShow + 1;
    const endPage = Math.min(startPage + maxPageNumbersToShow - 1, nPage);
    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        if (currentPage === startPage && pageGroup > 0) {
            setPageGroup(pageGroup - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < nPage) {
            setCurrentPage(currentPage + 1);
        }
        if (currentPage === endPage && endPage < nPage) {
            setPageGroup(pageGroup + 1);
        }
    };

    return (
        <nav>
            <ul className='pagination pagination-gap'>
                {currentPage > 1 && (
                    <li className='page-item'>
                        <a className='page-link' onClick={prePage}>
                            Prev
                        </a>
                    </li>
                )}

                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`page-item ${currentPage === number ? 'active' : ''}`}
                    >
                        <a onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}

                {currentPage < nPage && endPage < nPage && (
                    <li className='page-item'>
                        <a className='page-link' onClick={nextPage}>
                            Next
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;

