import React from 'react';
import { useExternalScript } from '../../utils/useExternalScript';
import '../common/styles.css'

import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';

const defaultJszipJsSource = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.0/jszip.js";
const defaultXlsxJsSource = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.0/xlsx.full.min.js";

interface XlsGeneratorProps {
  bookName?: string;
  sheetName?: string;
  labelString?: string;
  data: any[];
  errorHandler?: any;
  xlsxJsSource?: string;
  jszipJsSource?: string;
  customButtonStyles?: any;
}

export const XlsGenerator: React.FC<XlsGeneratorProps> = ({
  bookName,
  sheetName,
  labelString,
  data,
  errorHandler,
  xlsxJsSource,
  jszipJsSource,
  customButtonStyles
}) => {
  const xlsxLoaded = useExternalScript(xlsxJsSource || defaultXlsxJsSource);
  const jszipLoaded = useExternalScript(jszipJsSource || defaultJszipJsSource);
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

  return <div>{xlsxLoaded && jszipLoaded && getButton()}</div>;
};

XlsGenerator.propTypes = {
  sheetName: PropTypes.string,
  errorHandler: PropTypes.func,
  xlsxJsSource: PropTypes.string,
  jszipJsSource: PropTypes.string,
  customButtonStyles: PropTypes.string
};
