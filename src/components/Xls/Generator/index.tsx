import React from 'react';
import '../common/styles.css'
//@ts-expect-error - no types for xlsx
import * as XLSX from 'xlsx/xlsx.mjs';
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';


interface XlsGeneratorProps {
  bookName?: string;
  sheetName?: string;
  labelString?: string;
  data: any[];
  errorHandler?: any;
  customButtonStyles?: any;
}

export const XlsGenerator: React.FC<XlsGeneratorProps> = ({
  bookName,
  sheetName,
  labelString,
  data,
  errorHandler,
  customButtonStyles
}) => {
  const buttonClassName = customButtonStyles ? null : 'btn btn-primary btn-sm'


  function generateFile() {
    const myFile = bookName || 'myFile.xlsx';
    const myWorkSheet = XLSX.utils.json_to_sheet(data);
    const myWorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, sheetName || 'mySheet');
    try {
      XLSX.writeFile(myWorkBook, myFile);
    } catch (err) {
      if (errorHandler) {
        errorHandler(err);
      } else {
        console.error(err);
      }
    }
  }

  const getButton = () => (
    <button className={buttonClassName} style={customButtonStyles} onClick={generateFile}>
      {labelString || 'Download xlsx file'}
    </button>
  );

  return <div>{getButton()}</div>;
};

XlsGenerator.propTypes = {
  sheetName: PropTypes.string,
  errorHandler: PropTypes.func,
  customButtonStyles: PropTypes.string
};
