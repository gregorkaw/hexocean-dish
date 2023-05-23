import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface IFormInputs {
  name: string;
  preparation_time: string;
  type: string;
  no_of_slices: number;
  diameter: number;
  spiciness_scale: number;
  slices_of_bread: number;
}

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit = (data: IFormInputs) => {console.log(data)}
  const [isPizza, setIsPizza] = useState(true);
  const [isSoup, setIsSoup] = useState(false);
  const [isSandwich, setIsSandwich] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage errors={errors} as="p" name="name" />
      <input
        type="text"
        placeholder="name"
        {...register("name", { required: "Please provide a name" })}
      />
      <ErrorMessage errors={errors} as="p" name="preparation_time" />
      <input
        type="text"
        placeholder="preparation_time"
        {...register("preparation_time", {
          required: { value: true, message: "prep time is required" },
          pattern: {
            value: /[0-9]{2}:[0-9]{2}:[0-9]{2}/i,
            message: "Please provide an correct input 00:00:00",
          },
        })}
      />
      <ErrorMessage errors={errors} as="p" name="type" />
      <select
        {...register("type", {
          required: { value: true, message: "Please Select An option" },
        })}
        onChange={(e) => {
          {
            if (e.target.value === "pizza") {
              setIsPizza(true);
              setIsSandwich(false);
              setIsSoup(false);
            }
            if (e.target.value === "soup") {
              setIsSoup(true);
              setIsPizza(false);
              setIsSandwich(false);
            }
            if (e.target.value === "sandwich") {
              setIsSandwich(true);
              setIsPizza(false);
              setIsSoup(false);
            }
          }
        }}
      >
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>
      {isPizza ? (
        <div className="pizza-div">
          <ErrorMessage errors={errors} as="p" name="no_of_slices" />
          <input
            type="number"
            placeholder="no_of_slices"
            {...register("no_of_slices", {
              required: {
                value: isPizza ? true : false,
                message: "please set a number",
              },
              min: { value: 1, message: "pleace" },
            })}
          />
          <ErrorMessage errors={errors} as="p" name="diameter" />
          <input
            type="number"
            step={0.01}
            placeholder="diameter"
            {...register("diameter", {
              required: {
                value: isPizza ? true : false,
                message: "please set a number",
              },
              min: { value: 0.01, message: "pleace" },
            })}
          />
        </div>
      ) : (
        ""
      )}
      {isSoup ? (
        <div>
          <p>How spicy would you like it?</p>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            placeholder="spiciness_scale"
            {...register("spiciness_scale", {
              required: isSoup ? true : false,
            })}
          />
        </div>
      ) : (
        ""
      )}
      {isSandwich ? (
        <div>
          {" "}
          <ErrorMessage errors={errors} as="p" name="slices_of_bread" />
          <input
            type="number"
            placeholder="slices_of_bread"
            {...register("slices_of_bread", {
              required: {
                value: isSandwich ? true : false,
                message: "please choose a number of slices of bread",
              },
              min: { value: 1, message: "pleace" },
            })}
          />
        </div>
      ) : (
        ""
      )}
      <div className="errors"></div>

      <input type="submit" />
    </form>
  );
}
