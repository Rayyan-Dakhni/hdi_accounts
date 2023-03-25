import Checkbox from "../inputs/checkbox";

const Table = (props) => {
  const tableHeaders = props.headers || [];

  return (
    <table className='w-full table-auto border'>
      <thead className='bg-gray-100'>
        <tr className='border'>
          <th className='w-12 h-full items-center justify-center border capitalize'>
            <Checkbox />
          </th>
          {tableHeaders.map((header, index) => (
            <th key={index} className='p-3 border capitalize'>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.values.map((val, index) => {
          const keyModel = Object.keys(val) || [];

          return (
            <tr key={index}>
              {keyModel.map((key, index) => {
                return (
                  <td key={index} className='te xt-center py-2'>
                    {val[key]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
