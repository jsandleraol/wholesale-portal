import * as React from 'react'
import { cloneElement, useMemo } from 'react'

import {
  useNotify,
  useRefresh,
  useRedirect,
  List,
  Create,
  ArrayField,
  FunctionField,
  Edit,
  SimpleForm,
  NumberInput,
  DisabledInput,
  BooleanInput,
  ImageInput,
  TextInput,
  DateInput,
  ArrayInput,
  LongTextInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  SimpleFormIterator,
  DateField,
  EditButton,
  Show,
  SimpleShowLayout,
  RichTextField,
  ShowButton,
  TopToolbar,
  Button,
  ImageField,
  DeleteButton,
  ListButton,
  CreateButton,
  ExportButton,
  useListContext,
  sanitizeListRestProps,
  AutocompleteInput
} from 'react-admin'
import { makeStyles } from '@material-ui/core/styles'

// const useStyles = makeStyles({
//   CreateForm: {
//       display: 'flex',
//       flexWrap: 'wrap'
//   },
// });
// const classes = useStyles()

export const ProductShow = props => {
  return (
    <Show actions={<ProductShowActions />} {...props}>
      <SimpleShowLayout>
        <TextField label='Product Name' source='name' /> 
        {/* <TextField label='Category' source='category' />
        <TextField label='Description' source='description' />
        <TextField label='Price' source='price' />
        <DateField label='Release date' source='date' /> */} 
        {/* <FunctionField
          label='Discount Intervals'
          render={record => {
            console.log('priceTiers: ', record.priceTiers)
            console.log('tiers: ', record.priceTiers.tiers)
            return (
              <ul>
                {record.priceTiers.tiers.map(item => {
                  return (
                    <li key={item.quantity}>
                      {item.id}: {item.ratio}{' '}
                    </li>
                  )
                })}
              </ul>
            )
          }}
        /> */}
        {/* <ArrayField label="Progessive Discounts" source="priceTiers[tiers]">
            <Datagrid>
              <TextField label='Quantity Interval' source="quantity" />
              <TextField label="Discount Per Unit" source="ratio" />
            </Datagrid>
          </ArrayField> */}
        {/* <ImageField source="imageData" /> */}
        <TextField label='Database ID' source='id' />
      </SimpleShowLayout>
    </Show>
  )
}

export const ProductList = props => (
  <List {...props}>
    <Datagrid actions={<ListActions />} rowClick='show'>
      {/* <TextField label='ID' source='id' /> */}
      <TextField label='Name' source='name' />
      <TextField label='Category' source='category' />
      <TextField label='Price' source='price' />
      <ShowButton basePath={props.basePath} record={props.data} />
      <DeleteButton />
    </Datagrid>
  </List>
)

const categories = [
  'Flower',
  'Edibles',
  'Concentrates',
  'Topicals',
  'Pet Products',
  'Accessories'
]

const productCategories = [
  { id: 'flower', name: 'Flower' },
  { id: 'edibles', name: 'Edibles' },
  { id: 'concentrates', name: 'Concentrates' },
  { id: 'topicals', name: 'Topicals' },
  { id: 'pet_products', name: 'Pet Products' },
  { id: 'accessories', name: 'Accessories' }
]

export const ProductCreate = props => {
  return (
    <Create {...props}>
      <SimpleForm>
        <AutocompleteInput source='category' choices={productCategories} />
        <TextInput label='Product Name' source='name' />
        <TextInput
          label='Description'
          source='description'
          options={{ multiLine: true }}
        />
        <NumberInput label='Base Price Per Unit' source='price' />
        <ArrayInput label='Price Tiers' source='priceTiers'>
          <SimpleFormIterator>
            <NumberInput label='Quantity' source='quantity' />
            <NumberInput label='Price per unit (USD)' source='price' />
          </SimpleFormIterator>
        </ArrayInput>
        <div className='product_create_metaData'>
          <div className='product_create_cbd'>
            <h2>CBD Contents</h2>

            <NumberInput
              label='Quantity (number)'
              source='metaData.cbd.quantity'
            />
            <TextInput
              label='Unit (%, mg, etc...)'
              source='metaData.cbd.unit'
            />
          </div>
          <div className='product_create_thc'>
            <h2>THC Contents</h2>
            <NumberInput
              label='Quantity (number)'
              source='metaData.thc.quantity'
            />
            <TextInput
              label='Unit (%, mg, etc...)'
              source='metaData.thc.unit'
            />
          </div>
          <div className='product_create_cbd'>
            <h2>Single Unit Contents</h2>
            <NumberInput
              label='Quantity (number)'
              source='metaData.units.quantity'
            />
            <TextInput
              label='Unit (mL, lbs, etc...)'
              source='metaData.units.unit'
            />
          </div>
          <div className='product_create_cbd'>
            <h2>Product Weight</h2>
            <p>used to calculate shipping costs</p>
            <NumberInput
              label='Weight (number)'
              source='metaData.weight.quantity'
            />
            <TextInput
              label='Unit (lbs, oz, etc...)'
              source='metaData.weight.unit'
            />
          </div>
        </div>
        <ImageInput
          source='images'
          label='Product Images'
          accept='image/*'
          multiple='true'
        >
          <ImageField source='src' title='title' />
        </ImageInput>
        <p>
          Please upload 1-5 product images. The first one uploaded will be the
          primary image
        </p>
        <BooleanInput label='Save as Draft' source='draft' />
      </SimpleForm>
    </Create>
  )
}

export const ProductEdit = props => {
  const notify = useNotify()
  const refresh = useRefresh()
  const redirect = useRedirect()

  const onSuccess = ({ data }) => {
    notify(`Changes to product "${data.name}" saved`)
    redirect('/admin-products')
    refresh()
  }
  return (
    <Edit
      onSuccess={onSuccess}
      actions={<ProductEditActions />}
      title={<ProductTitle />}
      {...props}
    >
      <SimpleForm>
        {/* {!} NEEDS TO BE DONE LATER TO EDIT ORDERS OF USERS */}
        {/* <ReferenceInput source="orderId" reference="orders"> */}
        <TextInput label='Product Name' source='name' />
        <TextInput label='Category' source='category' />
        <TextInput
          label='Description'
          source='description'
          options={{ multiLine: true }}
        />
        <NumberInput label='Price' source='price' />
        {/* <ImageInput source="imageData"/> */}
      </SimpleForm>
    </Edit>
  )
}

// custom components
const ProductTitle = ({ record }) => {
  return <span>Product {record ? `"${record.name}"` : ''}</span>
}

const ProductShowActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <EditButton basePath={basePath} record={data} />
    <DeleteButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
)
const ProductEditActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <ShowButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
)
const ListActions = props => {
  const { className, exporter, filters, maxResults, ...rest } = props
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    hasCreate,
    basePath,
    selectedIds,
    showFilter,
    total
  } = useListContext()
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      <DeleteButton basePath={basePath} />
      <CreateButton basePath={basePath} />
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      {/* Add your custom actions */}
      <Button
        onClick={() => {
          alert('Your custom action')
        }}
        label='Show calendar'
      ></Button>
    </TopToolbar>
  )
}