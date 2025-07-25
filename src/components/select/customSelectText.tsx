/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Select, { SingleValue } from 'react-select'
import { replaceByParam } from '@/helper'

export type SelectOption = {
  id: string
  name: string
  time?: string
  description?: string
}

type SelectCustomProp = {
  customSet: SelectOption[]
  excludeSet: SelectOption[]
  selectedCustomSet: string
  placeholder: string
  setSelectedCustomSet: (value: string) => void
}

export default function SelectCustomText({ customSet, excludeSet, selectedCustomSet, placeholder, setSelectedCustomSet }: SelectCustomProp) {
  const options: SelectOption[] = customSet
  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      backgroundColor: 'transparent',
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
    <div className="flex flex-col gap-1 w-full h-full z-50 text-warning-content ">
      <div
        className="font-bold text-lg"
        dangerouslySetInnerHTML={{
          __html: replaceByParam(
            option.name,
            []
          )
        }}
      />
      {option.time && <div className='text-base'>{option.time}</div>}
      {option.description && <div
        className="text-base"
        dangerouslySetInnerHTML={{
          __html: option.description
        }}
      />}
    </div>
  )

  return (
    <Select
      options={options.filter(opt => !excludeSet.some(ex => ex.id === opt.id))}
      value={options.find(opt => {
        return opt.id === selectedCustomSet
      }) || null}
      onChange={(selected: SingleValue<SelectOption>) => {
        setSelectedCustomSet(selected?.id || '')
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
