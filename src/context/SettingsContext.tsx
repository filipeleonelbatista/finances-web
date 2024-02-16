import { createContext, useCallback, useEffect, useState } from "react";

export const SettingsContext = createContext({});

export function SettingsContextProvider(props) {
  const [isEnableTitheCard, setIsEnableTitheCard] = useState(false)
  const [isEnableTotalHistoryCard, setIsEnableTotalHistoryCard] = useState(false)
  const [willUsePrefixToRemoveTihteSum, setWillUsePrefixToRemoveTihteSum] = useState(false)
  const [prefixTithe, setPrefixTithe] = useState('')

  const handleSetPrefixTithe = async (value) => {
    setPrefixTithe(value)
    localStorage.setItem('@PrefixTithe', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleWillRemovePrefixToRemove = async (value) => {
    setWillUsePrefixToRemoveTihteSum(value)
    localStorage.setItem('@WillUsePrefixToRemoveTihteSum', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSwitchViewTotalHistoryCard = async (value) => {
    console.log("OLA", value)
    setIsEnableTotalHistoryCard(value)
    localStorage.setItem('@IsEnableTotalHistoryCard', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSwitchViewTitheCard = async (value) => {
    setIsEnableTitheCard(value)
    localStorage.setItem('@IsEnableTitheCard', JSON.stringify(value))
    await updateStorageContext()
  }

  const updateStorageContext = async () => {
    try {
      await loadIsEnableTitheCard();
      await loadIsEnableTotalHistoryCard();
      await loadWillUsePrefixToRemoveTihteSum();
      await loadPrefixTithe();
    } catch (error) {
      console.log(error)
    }
  }

  const loadIsEnableTitheCard = async () => {
    const value = localStorage.getItem('@IsEnableTitheCard');
    if (value !== null) {
      setIsEnableTitheCard(JSON.parse(value))
    } else {
      setIsEnableTitheCard(isEnableTitheCard)
      localStorage.setItem('@IsEnableTitheCard', JSON.stringify(isEnableTitheCard))
    }
  }

  const loadIsEnableTotalHistoryCard = async () => {
    const value = localStorage.getItem('@IsEnableTotalHistoryCard');
    if (value !== null) {
      setIsEnableTotalHistoryCard(JSON.parse(value))
    } else {
      setIsEnableTotalHistoryCard(isEnableTotalHistoryCard)
      localStorage.setItem('@IsEnableTotalHistoryCard', JSON.stringify(isEnableTotalHistoryCard))
    }
  }

  const loadWillUsePrefixToRemoveTihteSum = async () => {
    const value = localStorage.getItem('@WillUsePrefixToRemoveTihteSum');
    if (value !== null) {
      setWillUsePrefixToRemoveTihteSum(JSON.parse(value))
    } else {
      setWillUsePrefixToRemoveTihteSum(willUsePrefixToRemoveTihteSum)
      localStorage.setItem('@WillUsePrefixToRemoveTihteSum', JSON.stringify(willUsePrefixToRemoveTihteSum))
    }
  }

  const loadPrefixTithe = async () => {
    const value = localStorage.getItem('@PrefixTithe');
    if (value !== null) {
      setPrefixTithe(JSON.parse(value))
    } else {
      setPrefixTithe(prefixTithe)
      localStorage.setItem('@PrefixTithe', JSON.stringify(prefixTithe))
    }
  }

  const loadData = useCallback(async () => {
    try {
      await loadIsEnableTitheCard();
      await loadIsEnableTotalHistoryCard();
      await loadWillUsePrefixToRemoveTihteSum();
      await loadPrefixTithe();
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData]);

  return (
    <SettingsContext.Provider
      value={{
        isEnableTitheCard,
        handleSwitchViewTitheCard,
        willUsePrefixToRemoveTihteSum,
        handleWillRemovePrefixToRemove,
        prefixTithe,
        handleSetPrefixTithe,
        isEnableTotalHistoryCard,
        handleSwitchViewTotalHistoryCard,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
