import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomTextInput from './../../components/CustomInput';
import CustomButton from './../../components/CustomButton';
import {_get, _post} from '../../api/apiClient';
import DateTimePickerComponent from './../../components/DateTimeSelector';
import TextareaWithIcon from './../../components/TextArea';
import {showError, showSuccess} from './../../components/FlashMessage';
import DropdownTextInput from '../../components/DropdownInput';

const InterestedDetails = ({navigation, route}) => {
  const {item, otherParam} = route.params;
  const [data, setData] = useState([]);
  const [budget, setBudget] = useState([]);
  const [project, setProject] = useState([]);
  const [sources, setSources] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(item?.name);
  const [number, setNumber] = useState(item?.mobile);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notes, setNotes] = useState('');
  const [requirement, setRequirementType] = useState('');
  const [propertyStages, setPropertyStages] = useState('');
  const [propertyTypes, setPropertyTypes] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [lesdSource, setLeadSource] = useState('');
  const [leadsStatus, setLeadsStatus] = useState('');
  const [nextFollowUpType, setNextFollowUpType] = useState('');
  const [nextFollowupTime, setFollowupTime] = useState('');
  const [propertyBudget, setPropertyBudget] = useState('');
  const [propertyProject, setPropertyProject] = useState('');
  const [leatType, leadTypes] = useState('');
  const [selectedValue, setSelectedValue] = useState(otherParam);

  const handleDropdownPress = () => {
    Alert.alert('Dropdown Clicked!', 'You can open a modal or picker here.');
  };

  console.log('itemmmmmmmmmmm', item);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get('/getresources');
        //console.log("resources api response", response);

        const result = await response.data;
        //console.log("resources api response", response.data.data);
        for (let key in response.data.data) {
          if (key == 'project') {
            let res = response.data.data[key].map(it => {
              let obj = {};
              obj.label = it.title;
              obj.id = it.id;
              obj.value = it.id;
              return obj;
            });
            setProject(res);
          }
          if (key == 'budget') {
            let res = response.data.data[key].map(it => {
              let obj = {};
              obj.label = it.name;
              obj.id = it.id;
              obj.value = it.id;
              return obj;
            });
            setBudget(res);
          }
          if (key == 'leadsources') {
            let res = response.data.data[key].map(it => {
              let obj = {};
              obj.label = it.name;
              obj.id = it.id;
              obj.value = it.id;
              return obj;
            });
            setSources(res);
          }
          if (key == 'lead_status') {
            let res = response.data.data[key].map(it => {
              let obj = {};
              obj.label = it.name;
              obj.id = it.id;
              obj.value = it.id;
              return obj;
            });
            setLeadStatus(res);
          }
        }
        if (response.status == 200) {
          setData(result);
        } else {
          showSuccess(response.data.message || 'Login failed');
        }
      } catch (error) {
        // console.error("API Error:sss", error);
        //showError('Something went wrong, please try again');
      }
    };
    fetchData();
    return () => {
      // Cleanup logic (optional, runs before the component unmounts or the effect re-runs)
    };
  }, []);

  const handleDateTimeSubmit = isoDateTime => {
    console.log('Formatted ISO date:', isoDateTime);
    setFollowupTime(isoDateTime);
    // This will output: 2025-01-29T10:03:00.000Z
  };

  const handleSubmit = async () => {
    if (!requirement) {
      showError('Select the requirement type');
      return;
    }
    if (!number) {
      showError('Enter mobile number');
      return;
    }
    if (!nextFollowUpType) {
      showError('Enter next follow up');
      return;
    }

    const data = {
      fullname: fullName,
      requirements: requirement,
      budget_id: propertyBudget,
      project_id: propertyProject,
      property_type: propertyTypes,
      property_stage: propertyStages,
      city: propertyLocation,
      followup_type: nextFollowUpType,
      followup_on: nextFollowupTime,
      alternative_no: number, 
      notes: notes,
      lead_type: otherParam,
      
    };
    //alert("hello");
    setIsLoading(true);
    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('requirements', requirement);
    formData.append('budget_id', propertyBudget);
    formData.append('project_id', propertyProject);
    formData.append('property_type', propertyTypes);
    formData.append('property_stage', propertyStages);
    formData.append('city', propertyLocation);
    formData.append('followup_type', nextFollowUpType);
    formData.append('followup_on', nextFollowupTime);
    // formData.append("sources", lesdSource);
    formData.append('alternative_no', number);
    formData.append('notes', notes);
    console.log('formDatatatatatatasssss====>>>>', data, item?.id);
    try {
      const response = await _post(`/leads/interested/save/${item?.id}`, data);
      //const userToken = response.data.access_token;
      // Handle API response
      if (response.status == 200) {
        showSuccess('Lead has been updated sucessfully');
        navigation.popTo('PendingLead');
        setIsLoading(false);
      } else {
        showMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('API Error:sss', error);
      //showError('Something went wrong, please try again');
      setIsLoading(false);
    }
  };

  const leadType = [
    {label: 'Data', value: 1},
    {label: 'Lead', value: 2},
  ];

  const dropdownData = [
    {label: 'New Project', value: 1},
    {label: 'Rental', value: 2},
    {label: 'Resale', value: 3},
  ];

  const propertyType = [
    {label: 'Residential', value: 1},
    {label: 'Commercial', value: 2},
    {label: 'Industrial', value: 3},
  ];

  const propertyStage = [
    {label: 'Under Construction', value: 1},
    {label: 'Ready To Move', value: 2},
    {label: 'Pre Launch', value: 3},
  ];

  const location = [
    {label: 'Delhi', value: 1},
    {label: 'Noida', value: 2},
    {label: 'Gurugram', value: 3},
    {label: 'Ghaziabad', value: 4},
    {label: 'Faridabad', value: 5},
  ];

  const followUpType = [
    {label: 'Follow up', value: 5},
    {label: 'Meetings', value: 6},
    {label: 'Site visit', value: 7},
  ];

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>REQUIREMENT TYPE</Text>
        <CustomDropdown
          data={dropdownData}
          onSelect={item => {
            {
              setSelectedItem(item);
              setRequirementType(item.value);
            }
          }}
          placeholder="Choose an option"
        />
        <Text style={styles.title}>FULLNAME*</Text>
        <CustomTextInput
          keyboardType="default"
          iconName="person"
          placeholder="Full Name"
          value={fullName}
          onChangeText={value => setFullName(value)}
        />
        {/* {text ? <Text style={styles.output}>You entered: {text}</Text> : null} */}

        {/* <Text style={styles.title}>LAST NAME*</Text>
        <CustomTextInput
          keyboardType="default"
          iconName="person"
          placeholder="Last Name"
          value={lastName}
          onChangeText={(value) => setLastName(value)}
        /> */}
        {/* {text ? <Text style={styles.output}>You entered: {text}</Text> : null} */}

        <Text style={styles.title}>ALTERNATIVE NUMBER</Text>
        <CustomTextInput
          keyboardType="numeric"
          iconName="phone"
          placeholder="Number"
          value={number}
          maxLength={13}
          onChangeText={value => setNumber(value)}
        />

        <Text style={styles.title}>BUDGET</Text>
        <CustomDropdown
          data={budget}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyBudget(item.id);
            }
          }}
          placeholder={item?.budget ? item?.budget : 'Choose an option'}
        />
        <Text style={styles.title}>PROJECT</Text>
        <CustomDropdown
          data={project}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyProject(item.value);
            }
          }}
          placeholder={
            item?.projectname ? item?.projectname : 'Choose an option'
          }
        />

        <Text style={styles.title}>PROPERTY TYPE</Text>
        <CustomDropdown
          data={propertyType}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyTypes(item.value);
            }
          }}
          placeholder={
            item?.projectType ? item?.projectType : 'Select the property type'
          }
        />
        {/* <Text style={styles.title}>PROPERTY SUB TYPE</Text>
            <CustomDropdown
                data={dropdownData}
                onSelect={(item) => setSelectedItem(item)}
                placeholder="Choose an option"
            /> */}
        <Text style={styles.title}>PROPERTY STAGE</Text>
        <CustomDropdown
          data={propertyStage}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyStages(item.value);
            }
          }}
          placeholder={
            item?.propertyStage ? item?.propertyStage : 'Choose an option'
          }
        />
        <Text style={styles.title}>LEAD TYPE</Text>
        {/* <CustomDropdown
          data={leadType}
          onSelect={item => {
            {
              setSelectedItem(item);
              leadTypes(item.value);
            }
          }}
          placeholder={
            item?.propertyStage ? item?.propertyStage : 'Choose an option'
          }
        /> */}
        <DropdownTextInput value={selectedValue} />
        <Text style={styles.title}>LOCATION</Text>
        <CustomDropdown
          data={location}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyLocation(item.value);
            }
          }}
          placeholder={item?.location ? item?.location : 'Choose an option'}
        />
        <Text style={styles.title}>SOURCES</Text>
        <CustomDropdown
          data={sources}
          onSelect={item => {
            {
              setSelectedItem(item);
              setLeadSource(item.label);
            }
          }}
          placeholder="Choose an option"
        />
        <Text style={styles.title}>Next Follow-Up Type</Text>
        <CustomDropdown
          data={followUpType}
          onSelect={item => {
            {
              setSelectedItem(item);
              setNextFollowUpType(item.value);
            }
          }}
          placeholder="Choose an option"
        />
        <Text style={styles.title}>Next Follow-Up Time And Date</Text>
        <DateTimePickerComponent onDateChange={handleDateTimeSubmit} />
        {/* Next Follow-Up date */}
        {/* <Text style={styles.title}>STATE</Text>
            <CustomDropdown
                data={dropdownData}
                onSelect={(item) => setSelectedItem(item)}
                placeholder="Choose an option"
            /> */}

        <Text style={styles.title}>NOTES</Text>
        <TextareaWithIcon value={notes} onChangeText={text => setNotes(text)} />
      </ScrollView>

      {/* Fixed Submit Button */}
      <View style={styles.button}>
        <CustomButton
          title={isLoading ? 'Submit...' : 'Submit'}
          //onPress={handlePress}
          isLoading={isLoading}
          disabled={false}
          textStyle={{fontSize: 18}}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 5,
    paddingBottom: 80, // Space for the button
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    left: 17,
    right: 17,
    // backgroundColor: "#007BFF",
    // padding: 15,
    // alignItems: "center",
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InterestedDetails;
