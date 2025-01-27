import Select from 'react-select';
import { useAtom } from 'jotai';
import { contentTypeAtom } from '../store';

const styles = {
  control: (base) => ({
    ...base,
    width: 150,
    backgroundColor: '#000',
    color: '#fff',
  }),
  option: (base) => ({
    ...base,
    backgroundColor: '#000',
    color: '#fff',
    ':hover': {
      backgroundColor: '#333',
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#000',
  }),
  input: (base) => ({
    ...base,
    color: '#fff',
  })
};

export default function ContentTypeSelect() {
  const [contentType, setContentType] = useAtom(contentTypeAtom);
  const options = [
    { value: 'sentences', label: 'Sentences' },
    { value: 'words', label: 'Words' }
  ];

  return (
    <Select
      options={options}
      value={options.find(opt => opt.value === contentType)}
      onChange={(selected) => {
        setContentType(selected.value)
      }}
      styles={styles}
    />
  );
}

ContentTypeSelect.propTypes = {
};
