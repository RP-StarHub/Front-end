interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  return (
    <div className='flex justify-center items-center pt-4'>
      <button
        className='mx-2 py-1 px-4 font-button font-scdream4 bg-sub text-background rounded-lg border-none disabled:opacity-50'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          className={`mx-1 px-2 font-button font-sub font-scdream4 bg-transparent border-none ${currentPage === index + 1 ? 'font-scdream6' : 'font-scdream4'
            }`}
          key={index}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className='mx-2 py-1 px-4 font-button font-scdream4 bg-sub text-white rounded-lg border-none disabled:opacity-50'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  )
}

export default Pagination;