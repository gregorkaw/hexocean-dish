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
  const [isPizza, setIsPizza] = useState(false);
  const [isSoup, setIsSoup] = useState(false);
  const [isSandwich, setIsSandwich] = useState(false);
  const [isSucces, setIsSucces] = useState(false);

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
      setIsSucces(true);
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-control p-4">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the name of the dish?</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
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
        <label className="label">
          <span className="label-text-alt text-error">
            <ErrorMessage errors={errors} name="name" />
          </span>
        </label>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">How long does it take to prepare?</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="text"
          placeholder="hh:mm:ss"
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
        <label className="label">
          <span className="label-text-alt text-error">
            <ErrorMessage errors={errors} name="preparation_time" />
          </span>
        </label>
      </div>

      <select
        className="select select-bordered w-full max-w-xs"
        {...register("type", {
          required: true,
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
        <option disabled selected className="font-bold">
          Choose a dish type
        </option>
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>

      <div className="">
        {isPizza ? (
          <div className="">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">How much slices do you want?</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                type="number"
                placeholder="Number of slices"
                {...register("no_of_slices", {
                  required: {
                    value: isPizza ? true : false,
                    message: "Please provide a value",
                  },
                  min: {
                    value: 1,
                    message: "The amount needs to be more than 0",
                  },
                })}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  <ErrorMessage errors={errors} name="no_of_slices" />
                </span>
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">What is the diameter?</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                type="number"
                step={0.01}
                placeholder="Diameter"
                {...register("diameter", {
                  required: {
                    value: isPizza ? true : false,
                    message: "Please provide a value",
                  },
                  min: {
                    value: 0.01,
                    message: "The amount needs to be more than 0",
                  },
                })}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  <ErrorMessage errors={errors} name="diameter" />
                </span>
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
        {isSoup ? (
          <div className="form-control w-full max-w-xs mt-4">
            <label className="label">
              <span className="label-text">How spicy would you like it?</span>
            </label>
            <input
              className="range"
              type="range"
              min="0"
              max="10"
              step="1"
              placeholder="How spicy?"
              {...register("spiciness_scale", {
                required: isSoup ? true : false,
              })}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </div>
        ) : (
          ""
        )}
        {isSandwich ? (
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">
                How many slices of bread are there?
              </span>
            </label>
            <input
              className="input input-bordered w-full max-w-xs"
              type="number"
              placeholder="Number of slices"
              {...register("slices_of_bread", {
                required: {
                  value: isSandwich ? true : false,
                  message: "Please provide a number of breadslices",
                },
                min: {
                  value: 1,
                  message: "The amount needs to be more than 0",
                },
              })}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                <ErrorMessage errors={errors} name="slices_of_bread" />
              </span>
            </label>
          </div>
        ) : (
          ""
        )}
      </div>
      <input className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg mt-4 w-24" type="submit" value="Submit" />
      {isSucces ? <div>Success!</div> : ""}
    </form>
  );
}
