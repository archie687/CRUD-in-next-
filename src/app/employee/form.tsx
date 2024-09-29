"use client";
import React, { useState, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
  Resolver,
} from "react-hook-form";
import { Button, Drawer, Select, Modal } from "antd";
import { IEmployee } from "../../../Types/employee.type";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Utils from "../../../Utils/utils";
import Input from "../../../Components/inputs";
import RadioInput from "../../../Components/radiotypeinput";
import FileInput from "../../../Components/fileinput";
import CountryRegionDropdown from "../../../Components/country_region";
import DateInput from "../../../Components/datepicker";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "Name must contain only letters")
    .required("Name is required"),
  age: Yup.number().required("Age is required").positive().integer(),
  gender: Yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
  date: Yup.string().required("Date is required"),
  feedback: Yup.string().nullable(),
  country: Yup.string().required("Country is required"),
  region: Yup.string().required("Region is required"),
  salaryFields: Yup.array().of(
    Yup.object().shape({
      salary: Yup.number().required("Salary is required").positive().integer(),
      monthOfSalary: Yup.string().required("Month of Salary is required"),
      pf: Yup.number().required("PF is required").positive().integer(),
    })
  ),
});

const months = {
  January: "January",
  February: "February",
  March: "March",
  April: "April",
  May: "May",
  June: "June",
  July: "July",
  August: "August",
  September: "September",
  October: "October",
  November: "November",
  December: "December",
};

const Form = ({
  open,
  setOpen,
  editing,
  fetchemployee,
}: {
  open: boolean;
  setOpen: (a: boolean) => void;
  editing: IEmployee | undefined;
  fetchemployee: () => void;
}) => {
  const [, setSubmittedData] = useState<IEmployee | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateValue, setDateValue] = useState<Date | null>(
    editing ? new Date(editing.date) : null
  );

  const defaultValues = {
    name: "",
    age: 0,
    gender:"",
    date: "",
    feedback:"",
    country:"",
    region: "",
    salaryFields:[],
    images: [],
  };

  const zoomedImageContent = zoomedImage ? (
    <img
      src={zoomedImage}
      alt="Zoomed"
      style={{
        maxWidth: "100%",
        maxHeight: "80vh",
        objectFit: "contain",
      }}
    />
  ) : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm<IEmployee>({
    defaultValues,
    resolver: yupResolver(validationSchema) as unknown as Resolver<IEmployee>,
  });

  useEffect(() => {
    if (editing) {
      reset(editing);
      setImagePreviews(editing.images || []);
    } else {
      reset(defaultValues);
      setImagePreviews([]);
    }
  }, [editing, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "salaryFields",
  });

  const handleDateChange = (date: Date | null) => {
    setDateValue(date);
    if (date) {
      const formattedDate = date.toLocaleDateString("en-CA"); 
      setValue("date", formattedDate); 
    }
  };
  

  const handleImageClick = (preview: string) => {
    setZoomedImage(preview);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setZoomedImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImagePreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImagePreviews.push(reader.result as string);
          if (newImagePreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newImagePreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };    

  const handleImageDelete = (index: number) => {
    setImagePreviews((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<IEmployee> = async (data) => {
    data.images = imagePreviews;
    console.log("Form data before submission:", data);
    try {
      setSubmittedData(data);
      const utils = new Utils();
      if (editing) {
        await utils.put("/posts/" + editing.id, {
          ...data,
          id: editing.id,
        });
      } else {
        await utils.post("/posts", { ...data, id: uuidv4() });
      }
      fetchemployee();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={` ${open ? "" : "css"}`}>
      <Drawer
        title={editing ? "Edit Employee" : "Add New Employee"}
        width={600}
        onClose={() => setOpen(false)}
        open={open}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg"
        >
          <h2 className="text-2xl font-semibold text-center text-teal-600">
            {editing ? "Edit Employee Details" : "Add New Employee"}
          </h2>

          <div className="">
            <Input
              label="Name"
              name="name"
              register={register}
              placeholder="Enter employee name"
              errors={errors}
            />
            <Input
              label="Age"
              name="age"
              register={register}
              placeholder="Enter employee age"
              errors={errors}
            />

            <RadioInput
              label="Gender"
              name="gender"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              selectedValue={watch("gender")}
              register={register}
            />

            <DateInput
              name="dateOfBirth"
              label="Date of Birth"
              dateValue={dateValue}
              handleDateChange={handleDateChange}
            />

            <Input
              label="Feedback"
              name="feedback"
              type="textarea"
              register={register}
              placeholder="Enter feedback"
              rows={4}
              errors={errors}
            />

            <CountryRegionDropdown
              name="country"
              label="Country"
              type="dropdown"
              control={control}
              watch={watch}
            />

            <CountryRegionDropdown
              name="region"
              label="Region"
              type="region"
              control={control}
              watch={watch}
            />

            <FileInput
              name="images"
              label="Select Images"
              handleImageChange={handleImageChange}
              imagePreviews={imagePreviews}
              handleImageDelete={handleImageDelete}
              handleImageClick={handleImageClick}
            />

            <Modal
              visible={isModalVisible}
              onCancel={handleCloseModal}
              footer={null}
              style={{ textAlign: "center" }}
            >
              {zoomedImageContent}
            </Modal>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Salary Fields</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-center mb-4">
                  <input
                    type="number"
                    placeholder="Salary"
                    {...register(`salaryFields.${index}.salary`)}
                    className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Controller
                    name={`salaryFields.${index}.monthOfSalary`}
                    control={control}
                    defaultValue={field.monthOfSalary}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Select
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        ref={ref}
                        className="w-full"
                        placeholder="Month of Salary"
                      >
                        {Object.keys(months).map((month) => (
                          <Select.Option key={month} value={month}>
                            {month}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  <input
                    type="number"
                    placeholder="PF"
                    {...register(`salaryFields.${index}.pf`)}
                    className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button
                    type="link"
                    onClick={() => remove(index)}
                    icon={<FontAwesomeIcon icon={faXmark} />}
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => append({ salary: 0, monthOfSalary: "", pf: 0 })}
                icon={<FontAwesomeIcon icon={faPlus} />}
                className="mt-4"
              >
                Add Salary Field
              </Button>
            </div>

            <Button type="primary" htmlType="submit" className="mt-4 w-full">
              {editing ? "Update" : "Add"} Employee
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Form;
