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
  const [isPizza, setIsPizza] = useState(true);
  const [isSoup, setIsSoup] = useState(false);
  const [isSandwich, setIsSandwich] = useState(false);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit = async (data: IFormInputs) => {
    console.log(data);
    try {
      const response = await fetch(
        "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col py-12 container w-[25%] min-h-full justify-between items-center bg-white rounded-xl bg-opacity-50"
    >
        
      <div className="flex flex-col">
        
        <div className="p-4 flex gap-8">
          <input
            className="p-2 rounded-xl"
            type="text"
            placeholder="Add dish name:"
            {...register("name", {
              required: "Please provide a name",
              minLength: {
                value: 3,
                message: "The name needs to be at least 3 characters",
              },
            })}
          />
          <ErrorMessage errors={errors} name="name" />
        </div>
        <div className="p-4 flex gap-8">
          
          <input
            className="p-2 rounded-xl"
            type="text"
            placeholder="Preparation time:"
            max={8}
            {...register("preparation_time", {
              required: {
                value: true,
                message: "Please provide a preparation time",
              },
              pattern: {
                value: /[0-9]{2}:[0-9]{2}:[0-9]{2}/i,
                message: "Please provide a correct format: hh:mm:ss",
              },
              maxLength: {
                value: 8,
                message: "Please provide a correct format: hh:mm:ss",
              },
            })}
          />
          <ErrorMessage errors={errors} name="preparation_time" />
        </div>
        <div className="p-4 flex flex-col gap-2 justify-center">
          <p className="text-black text-lg">Dish type:</p>
          <select
            className="p-2 rounded-xl"
            {...register("type", {
              required: true
            })}
            onChange={(e) => {
              {
                if (e.target.value === "pizza") {
                  setIsPizza(true);

                  setIsSandwich(false);
                  unregister("slices_of_bread");

                  setIsSoup(false);
                  unregister("spiciness_scale");
                }
                if (e.target.value === "soup") {
                  setIsSoup(true);

                  setIsPizza(false);
                  unregister("no_of_slices");
                  unregister("diameter");

                  setIsSandwich(false);
                  unregister("slices_of_bread");
                }
                if (e.target.value === "sandwich") {
                  setIsSandwich(true);

                  setIsPizza(false);
                  unregister("no_of_slices");
                  unregister("diameter");

                  setIsSoup(false);
                  unregister("spiciness_scale");
                }
              }
            }}
          >
            <option value="pizza">Pizza</option>
            <option value="soup">Soup</option>
            <option value="sandwich">Sandwich</option>
          </select>
          <ErrorMessage errors={errors} name="type" />
        </div>
        <p className="text-lg text-center p-6">Additional choices:</p>
      </div>

      <div className="h-[25%]">
        {isPizza ? (
          <div className="flex flex-col">
            <div className="p-4 flex gap-8">
              <input
                className="p-2 rounded-xl"
                type="number"
                placeholder="no_of_slices"
                {...register("no_of_slices", {
                  required: {
                    value: isPizza ? true : false,
                    message: "Please provide a value",
                  },
                  min: { value: 1, message: "The amount needs to be more than 0" },
                })}
              />
              <ErrorMessage errors={errors} name="no_of_slices" />
            </div>
            <div className="p-4 flex gap-8">
              <input
                className="p-2 rounded-xl"
                type="number"
                step={0.01}
                placeholder="diameter"
                {...register("diameter", {
                  required: {
                    value: isPizza ? true : false,
                    message: "Please provide a value",
                  },
                  min: { value: 0.01, message: "The amount needs to be more than 0" },
                })}
              />
              <ErrorMessage errors={errors} name="diameter" />
            </div>
          </div>
        ) : (
          ""
        )}
        {isSoup ? (
          <div className="flex flex-col">
            <p>How spicy would you like it?</p>
            <input
              className="p-2"
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
          <div className="p-4 flex gap-8">
            <input
              className="p-2 rounded-xl"
              type="number"
              placeholder="slices_of_bread"
              {...register("slices_of_bread", {
                required: {
                  value: isSandwich ? true : false,
                  message: "Please provide a number of breadslices",
                },
                min: { value: 1, message: "The amount needs to be more than 0" },
              })}
            />
            <ErrorMessage errors={errors} name="slices_of_bread" />
          </div>
        ) : (
          ""
        )}
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}
