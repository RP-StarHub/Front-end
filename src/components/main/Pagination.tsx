interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const getPageList = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 항상 1페이지 표시
    pageNumbers.push(1);

    // 앞 생략 표시
    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    // 현재 페이지 주변 표시
    for (let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++) {
      pageNumbers.push(i);
    }

    // 뒤 생략 표시  
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    // 마지막 페이지 표시
    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <div className='flex justify-center items-center pt-4'>
      <button
        aria-label='이전 페이지'
        className='mx-2 py-1 px-4 font-button font-scdream4 bg-sub text-background rounded-lg border-none disabled:opacity-50'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {getPageList().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          aria-current={typeof page === 'number' && page === currentPage ? 'page' : undefined}
          className={`
            mx-1 px-2 font-button font-sub font-scdream4 bg-transparent border-none
            ${typeof page === 'number'
              ? page === currentPage
                ? 'font-scdream6'
                : 'font-scdream4'
              : ''
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        aria-label='다음 페이지'
        className='mx-2 py-1 px-4 font-button font-scdream4 bg-sub text-white rounded-lg border-none disabled:opacity-50'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;