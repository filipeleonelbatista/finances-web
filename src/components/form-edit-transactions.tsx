import { usePayments } from "@/hooks/usePayments";
import { DatePicker } from "./date-picker";
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
import { Switch } from "./ui/switch";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Textarea } from "./ui/textarea";

function FormEditTransaction({ selectedTransaction }) {
  const { categoriesList, updateTransaction, deleteTransaction } =
    usePayments();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      description: Yup.string().required("O campo Descrição é obrigatório"),
      about: Yup.string(),
      amount: Yup.string().required("O campo Valor é obrigatório"),
      category: Yup.string(),
      date: Yup.string().required(),
      paymentDate: Yup.string(),
      paymentStatus: Yup.boolean(),
      isEnabled: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      description: selectedTransaction.description,
      about: selectedTransaction.about,
      amount: moeda(selectedTransaction.amount.toFixed(2)),
      date: selectedTransaction.date !== "" ? selectedTransaction.date : "",
      paymentDate:
        selectedTransaction.paymentDate !== ""
          ? selectedTransaction.paymentDate
          : "",
      paymentStatus: selectedTransaction.paymentStatus,
      category: selectedTransaction.category ?? "Outros",
      isEnabled: selectedTransaction.isEnabled,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    const data = {
      ...selectedTransaction,
      amount: parseFloat(
        formValues.amount.replaceAll(".", "").replace(",", ".")
      ),
      date:
        formValues.date !== ""
          ? new Date(formValues.date).getTime() + 43200000
          : "",
      paymentDate:
        formValues.paymentDate !== ""
          ? new Date(formValues.paymentDate).getTime() + 43200000
          : "",
      about: formValues.about,
      description: formValues.description,
      category: formValues.isEnabled ? formValues.category : "Ganhos",
      paymentStatus: formValues.paymentStatus,
      isEnabled: formValues.isEnabled,
    };

    updateTransaction(data);

    document.getElementById("close-dialog")?.click();
  }

  function moeda(e) {
    let value = e;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
  }
  const toggleSwitch = () =>
    formik.setFieldValue("isEnabled", !formik.values.isEnabled);

  const toggleSwitchPaymentStatus = () => {
    if (!formik.values.paymentStatus) {
      formik.setFieldValue("paymentDate", new Date());
    } else {
      formik.setFieldValue("paymentDate", "");
    }

    formik.setFieldValue("paymentStatus", !formik.values.paymentStatus);
  }

  const onChange = (selectedDate) => {
    formik.setFieldValue("date", selectedDate);
  };

  const onChangePaymentDate = (selectedDate) => {
    formik.setFieldValue("paymentDate", selectedDate);
  };

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
      <div>
        <Label htmlFor="about">Sobre</Label>
        <Textarea
          id="about"
          onChange={(event) =>
            formik.setFieldValue("about", event.target.value)
          }
          value={formik.values.about}
        />
        <p className="text-sm text-gray-800 dark:text-gray-200">
          Escreva alguma informação sobre este pagamento...
        </p>
        {formik.errors.about && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.about}
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
            {categoriesList.map((cat, index) => {
              if (index == 0) return null;
              return (
                <SelectItem key={index} value={cat}>
                  {cat}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {formik.errors.category && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.category}
          </p>
        )}
      </div>

      <div>
        <DatePicker
          date={formik.values.paymentDate}
          setDate={onChangePaymentDate}
          label="Data de pagamento"
          id="paymentDate"
        />

        {formik.errors.paymentDate && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.paymentDate}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formik.values.isEnabled}
            onClick={toggleSwitch}
            id="isEnabled"
          />
          <Label htmlFor="isEnabled">É despesa?</Label>
        </div>

        {formik.errors.paymentStatus && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.paymentStatus}
          </p>
        )}

        <p>Deixe marcado caso esteja adicionando uma saída (Despesa)</p>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formik.values.paymentStatus}
            onClick={toggleSwitchPaymentStatus}
            id="isEnabled"
          />
          <Label htmlFor="isEnabled">Foi pago?</Label>
        </div>

        {formik.errors.paymentStatus && (
          <p className="text-sm text-red-600 dark:text-red-300">
            {formik.errors.paymentStatus}
          </p>
        )}
      </div>

      <Button
        onClick={formik.submitForm}
        className="bg-purple-600 hover:bg-purple-900"
      >
        Salvar
      </Button>

      <Button
        onClick={() => {
          deleteTransaction(selectedTransaction);

          document.getElementById("close-dialog")?.click();
        }}
        className="bg-red-600 hover:bg-red-900"
      >
        <IoTrashOutline className="w-4 h-4 mr-2" />
        Excluir
      </Button>
    </div>
  );
}

export default FormEditTransaction;
