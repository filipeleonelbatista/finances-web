import { useRuns } from "@/hooks/useRuns";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePicker } from "./date-picker";
import dayjs from "dayjs";

function FormAddRunItem() {
  const { addTransaction } = useRuns();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      currentDistance: Yup.string().required("O campo Km Atual é obrigatório"),
      unityAmount: Yup.string().required("O campo Valor do litro é obrigatório"),
      amount: Yup.string().required("O campo Valor Pago é obrigatório"),
      type: Yup.string().required("O campo Tipo do combustível é obrigatório"),
      date: Yup.string().required("O campo Data é obrigatório"),
      location: Yup.string().required("O campo Local é obrigatório"),
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      currentDistance: '',
      unityAmount: '',
      amount: '',
      type: 'Gasolina comum',
      date: dayjs().toDate(),
      location: '',
    },
    validationSchema: formSchema,
    onSubmit: values => {
      handleSubmitForm(values)
    },
  });

  async function handleSubmitForm(formValues) {
    const data = {
      currentDistance: parseFloat(formValues.currentDistance.replaceAll('.', '').replace(',', '.')),
      type: formValues.type,
      unityAmount: parseFloat(formValues.unityAmount.replaceAll('.', '').replace(',', '.')),
      amount: parseFloat(
        formValues.amount.replaceAll(".", "").replace(",", ".")
      ),
      date:
        formValues.date !== ""
          ? new Date(formValues.date).getTime() + 43200000
          : "",
      location: formValues.location,
    }

    addTransaction(data);

    document.getElementById("close-dialog")?.click();
  }

  const onChange = (selectedDate) => {
    formik.setFieldValue("date", selectedDate);
  };


  function moeda(e) {
    let value = e;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
  }

  const categoryArray = [
    "Gasolina comum",
    "Gasolina aditivada",
    "Etanol",
    "Etanol aditivada",
    "Carga elétrica",
    "GNV",
    "Dísel",
    "Dísel-S10",
    "Dísel aditivado",
  ]

  return (
    <div className="w-full max-h-96 overflow-auto flex flex-col space-y-4 p-2">
      <div>
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          onChange={(event) =>
            formik.setFieldValue("location", event.target.value)
          }
          value={formik.values.location}
        />
        {formik.errors.location && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.location}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="currentDistance">Km Atual</Label>
        <Input
          id="currentDistance"
          inputMode="numeric"
          onChange={(event) =>
            formik.setFieldValue("currentDistance", event.target.value)
          }
          value={formik.values.currentDistance}
        />
        {formik.errors.currentDistance && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.currentDistance}
          </p>
        )}
      </div>

      <div>
        <Label>Valor do litro</Label>
        <Input
          id="unityAmount"
          inputMode="numeric"
          onChange={(event) =>
            formik.setFieldValue("unityAmount", moeda(event.target.value))
          }
          value={formik.values.unityAmount}
        />
        {formik.errors.unityAmount && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.unityAmount}
          </p>
        )}
      </div>

      <div>
        <Label>Valor pago</Label>
        <Input
          id="amount"
          inputMode="numeric"
          onChange={(event) =>
            formik.setFieldValue("amount", moeda(event.target.value))
          }
          value={formik.values.amount}
        />
        {formik.errors.amount && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.amount}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-1">
        <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
          Tipo do combustivel
        </p>
        <Select
          value={formik.values.type}
          onValueChange={(value) => formik.setFieldValue("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tipo do combustivel" />
          </SelectTrigger>
          <SelectContent>
            {
              categoryArray.map((item, index) => <SelectItem key={index} value={item}>{item}</SelectItem>)
            }
          </SelectContent >
        </Select >

        {formik.errors.type && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.type}
          </p>
        )}
      </div>

      <div>
        <DatePicker
          date={formik.values.date}
          setDate={onChange}
          label="Data de vencimento"
          id="date"
        />

        {formik.errors.date && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.date}
          </p>
        )}
      </div>

      <Button
        onClick={formik.submitForm}
        className="bg-purple-600 hover:bg-purple-900"
      >
        Adicionar
      </Button>
    </div>
  );
}

export default FormAddRunItem;
