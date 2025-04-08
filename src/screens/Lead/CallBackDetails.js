import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomDropdown from "./../../components/CustomDropDown";
import CustomButton from "./../../components/CustomButton";
import TextareaWithIcon from "./../../components/TextArea";
import DateTimePickerComponent from "./../../components/DateTimeSelector";
import { showError, showSuccess } from "./../../components/FlashMessage";
import { _post } from "../../api/apiClient";

const CallBackDetails = ({navigation, route}) => {
  const {item} = route.params;
  console.log("itemid in callback", item?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [callBackReasonNotes, setCallBackReasonNotes] = useState("");
  const [callBackReason, setCallBackReason] = useState("");
  const [callBackTime, setCallBackTime] = useState("");
  const dropdownData = [
    { label: "Not Picked", value: 8 },
    { label: "Not Reacheable", value: 9 },
    { label: "On Request", value: 10 },
    { label: "Switched", value: 11 },
  ];

  const handleDateTimeSubmit = (isoDateTime) => {
    console.log('Formatted ISO date:', isoDateTime);
    setCallBackTime(isoDateTime)
    // This will output: 2025-01-29T10:03:00.000Z
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("substatus_id", '8');
    formData.append("followup_on", '2025-01-29T10:03:00.000Z');
    formData.append("notes", 'hi');
    console.log("formDatatatatatata", formData, item?.id);

    const data = {
      substatus_id: callBackReason,
      followup_on: callBackTime,
      notes: callBackReasonNotes,
    }
    try {
      const response = await _post(`/leads/callback/save/${item?.id}`, data
      );
      console.log("responseeeeenotin", response.data);
      //const userToken = response.data.access_token;
      // Handle API response
      if (response.status == 200) {
        showSuccess("Lead has been updated sucessfully");
        navigation.popTo("PendingLead");
        setIsLoading(false);
      } else {
        showMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("API Error:sss", error);
      //showError("Something went wrong, please try again");
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>CALL BACK REASON</Text>
      <CustomDropdown
        data={dropdownData}
        onSelect={(item) => setCallBackReason(item.value)}
        placeholder="Choose an option"
      />
      <Text style={styles.title}>NEXT FOLLOW UP DATE AND TIME</Text>
      <DateTimePickerComponent onDateChange={handleDateTimeSubmit} />
      <Text style={styles.title}>CALL BACK REASON</Text>
      <TextareaWithIcon
        value={callBackReasonNotes}
        onChangeText={(text) => setCallBackReasonNotes(text)}
      />

      <View style={{ margin: 16 }}>
        <CustomButton
          title={isLoading ? "Submit..." : "Submit"}
          //onPress={handlePress}
          isLoading={isLoading}
          disabled={false}
          textStyle={{ fontSize: 18 }}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginTop: 16,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});

export default CallBackDetails;
