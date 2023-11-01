import { ChangeEvent } from 'react';
import { useExternalScript } from '../../utils/useExternalScript';
import '../common/styles.css'

import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';

const defaultJszipJsSource = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.0/jszip.js";
const defaultXlsxJsSource = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.0/xlsx.full.min.js";

export interface XlsReaderProps {
    sheetName?: string;
    headerRow?: number;
    arrayOfArrays?: boolean;
    callbackFn: (data: any) => void;
    labelString?: string;
    xlsxJsSource?: string;
    jszipJsSource?: string;
    fileReaderKey?: string;
  }

export function XlsReader({
    sheetName,
    headerRow,
    arrayOfArrays,
    callbackFn,
    labelString,
    xlsxJsSource,
    jszipJsSource,
    fileReaderKey,
  }: XlsReaderProps) {
    const xlsxLoaded = useExternalScript(xlsxJsSource || defaultXlsxJsSource);
    const jszipLoaded = useExternalScript(jszipJsSource || defaultJszipJsSource);
  
    function getOptions() {
      if (headerRow) {
        return { range: headerRow };
      } else if (arrayOfArrays) {
        return { header: 1 };
      }
    }
  
    function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
  
      reader.onload = function (event) {
        if (event.target) {
          const data = event.target.result as string;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetname = sheetName || workbook.SheetNames[0];
          const xlsxJsonObject = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetname],
            getOptions()
          );
          callbackFn(xlsxJsonObject);
        }
      };
  
      reader.readAsBinaryString(file);
    }
  
    const getFileInputButton = () => (
      <label className='btn btn-primary btn-sm'>
        <i className='fa fa-file' /> {labelString || 'Choose file'}
        <input
          key={fileReaderKey || 'filereader'}
          type='file'
          style={{ display: 'none' }}
          accept='.xls,.xlsx'
          name='image'
          onChange={(e) => handleChangeFile(e)}
        />
      </label>
    );
  
    return <div>{xlsxLoaded && jszipLoaded && getFileInputButton()}</div>;
  }
  
  XlsReader.propTypes = {
    sheetName: PropTypes.string,
    headerRow: PropTypes.number,
    arrayOfArrays: PropTypes.bool,
    callbackFn: PropTypes.func.isRequired,
    labelString: PropTypes.string,
    xlsxJsSource: PropTypes.string,
    jszipJsSource: PropTypes.string,
    fileReaderKey: PropTypes.string,
  };