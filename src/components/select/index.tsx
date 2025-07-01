'use client'
import Select, { SingleValue } from 'react-select'
import Image from 'next/image'
import useLocaleStore from '@/stores/localeStore'
import ParseText from '../parseText'

export type SelectOption = {
  value: string
  label: string
  imageUrl: string
}

type SelectCustomProp = {
  customSet:  SelectOption[]
  excludeSet:  SelectOption[]
  selectedCustomSet: string
  placeholder: string
  setSelectedCustomSet: (value: string) => void
}

export default function SelectCustom({ customSet, excludeSet, selectedCustomSet, placeholder, setSelectedCustomSet }: SelectCustomProp) {
  const options: SelectOption[] = customSet
  const { locale } = useLocaleStore()
  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }),
    menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
    menu: (provided: any) => ({ ...provided, zIndex: 9999 })
  }

  const formatOptionLabel = (option: SelectOption) => (
    <div className="flex items-center gap-1 bg-slate-400 w-full h-full z-50">
      <Image src={option.imageUrl} alt="" width={125} height={125} className="w-8 h-8 object-contain" />
      <ParseText className='text-black font-bold' text={option.label} locale={locale} />
    </div>
  )

  return (
    <Select
      options={options.filter(opt => !excludeSet.some(ex => ex.value === opt.value))}
      value={options.find(opt => {
        return opt.value === selectedCustomSet}) || null}
      onChange={(selected: SingleValue<SelectOption>) => {
        console.log(selected);
        setSelectedCustomSet(selected?.value || '')
      }}
      formatOptionLabel={formatOptionLabel}
      styles={customStyles}
      placeholder={placeholder}
      className="my-react-select-container" 
      classNamePrefix="my-react-select"
      isSearchable
      isClearable
    />
  )
}
