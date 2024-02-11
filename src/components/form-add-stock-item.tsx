import { useStock } from "@/hooks/useStock";
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

function FormAddStockItem() {
  const { addTransaction } = useStock();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      description: Yup.string().required("O campo Descrição é obrigatório"),
      amount: Yup.string().required("O campo Valor é obrigatório"),
      category: Yup.string().required("O campo Categoria é obrigatório"),
      quantity: Yup.string().required("O campo Quantidade é obrigatório"),
      quantityDesired: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      description: "",
      amount: "0,00",
      category: "Mercearia",
      quantity: "1",
      quantityDesired: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    const data = {
      amount: parseFloat(
        formValues.amount.replaceAll(".", "").replace(",", ".")
      ),
      quantity: parseInt(formValues.quantity),
      description: formValues.description,
      category: formValues.category,
      quantityDesired: !!formValues.quantityDesired
        ? parseInt(formValues.quantityDesired)
        : "",
    };
    
    addTransaction(data);

    document.getElementById("close-dialog")?.click();
  }

  function moeda(e) {
    let value = e;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
  }

  return (
    <div className="w-full max-h-96 overflow-auto flex flex-col space-y-4 p-2">
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          onChange={(event) =>
            formik.setFieldValue("description", event.target.value)
          }
          value={formik.values.description}
        />
        {formik.errors.description && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.description}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-1">
        <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
          Categorias
        </p>
        <Select
          value={formik.values.category}
          onValueChange={(value) => formik.setFieldValue("category", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Carnes">Carnes</SelectItem>
            <SelectItem value="Fruteira">Fruteira</SelectItem>
            <SelectItem value="Higiêne">Higiêne</SelectItem>
            <SelectItem value="Limpeza">Limpeza</SelectItem>
            <SelectItem value="Mercearia">Mercearia</SelectItem>
            <SelectItem value="Outros" >Outros</SelectItem>
          </SelectContent >
        </Select >

        {formik.errors.category && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.category}
          </p>
        )}
      </div>

      <div>
        <Label>Valor</Label>
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
      <div>
        <Label>Quantidade</Label>
        <Input
          id="quantity"
          inputMode="numeric"
          onChange={(event) =>
            formik.setFieldValue("quantity", event.target.value)
          }
          value={formik.values.quantity}
        />
        {formik.errors.quantity && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.quantity}
          </p>
        )}
      </div>
      <div>
        <Label>Quantidade desejada</Label>
        <Input
          id="quantityDesired"
          inputMode="numeric"
          onChange={(event) =>
            formik.setFieldValue("quantityDesired", event.target.value)
          }
          value={formik.values.quantityDesired}
        />
        {formik.errors.quantityDesired && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.quantityDesired}
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

export default FormAddStockItem;
