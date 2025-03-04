import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomDropdown from '../../components/CustomDropDown';
import CustomTextInput from '../../components/CustomInput';
import CountryDropdown from '../../components/CountryDropDown';
// import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {_get, _post} from './../../api/apiClient';
import {showError, showSuccess} from '../../components/FlashMessage';

const AddContact = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState([]);
  const [project, setProject] = useState([]);
  const [sources, setSources] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [number, setNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [requirement, setRequirementType] = useState('');
  const [propertyStages, setPropertyStages] = useState('');
  const [propertyTypes, setPropertyTypes] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [lesdSource, setLeadSource] = useState('');
  const [leadsType, setLeadType] = useState('');
  const [propertyBudget, setPropertyBudget] = useState('');
  const [propertyProject, setPropertyProject] = useState('');

  const dropdownData = [
    {label: 'New Project', value: 1},
    {label: 'Rental', value: 2},
    {label: 'Resale', value: 3},
  ];

  const leadType = [
    {label: 'Lead', value: 1},
    {label: 'Data', value: 2},
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
  ];

  // const propertyStage = [
  //   { label: "Under Construction", value: 1 },
  //   { label: "Ready To Move", value: 2 },
  //   { label: "Pre Launch", value: 3 },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get('/getresources');

        const result = await response.data;
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
        //showError('Something went wrong, please try again');
      }
    };
    fetchData();
    return () => {
      // Cleanup logic (optional, runs before the component unmounts or the effect re-runs)
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get('/getresources');

        const result = await response.data;
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

  const handleSubmit = async () => {
    console.log("i am here")
    if(!requirement){
      showError("Select the requirement type")
      return;
    }
    if(!name){
      showError("Enter the name")
      return;
    }
    if(!mobileNumber){
      showError("Enter mobile number")
      return;
    }
    if(!leadsType){
      showError("Select the lead type")
      return;
    }
    if(!lesdSource){
      showError("Select the lead source")
      return;
    }
    //alert("hello");
    setIsLoading(true);

    const data = {
      name: name,
      email: email,
      mobile: mobileNumber,
      lead_type: leadsType,
      requirement_type: requirement,
      alternative_no: alternateNumber,
      project_id: propertyProject,
      property_stage: propertyStages,
      property_type: propertyTypes,
      property_sub_type: '2',
      budget: propertyBudget,
      location: propertyLocation,
      lead_stage: propertyStages,
      lead_source: lesdSource,
    };

    try {
      const response = await _post('/lead/create', JSON.stringify(data));
      if (response.status == 200) {
        showSuccess('Lead has been created  sucessfully');
        navigation.replace('Contact');
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

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>REQUIREMENT TYPE</Text>
        <CustomDropdown
          data={dropdownData}
          onSelect={item => setRequirementType(item.value)}
          placeholder="Choose an option"
        />
        {/* {selectedItem && (
            <Text style={styles.selectedText}>
              Selected: {selectedItem.label}
            </Text>
          )} */}
        <Text style={styles.title}>FIRST NAME*</Text>
        <CustomTextInput
          iconName="person"
          placeholder="First Name"
          value={name}
          onChangeText={value => setName(value)}
        />
        {/* {text ? <Text style={styles.output}>You entered: {text}</Text> : null} */}
        <Text style={styles.title}>CONTACT NUMBER</Text>

        <CustomTextInput
          iconName="phone"
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={mobileNumber}
          maxLength={13}
          onChangeText={value => setMobileNumber(value)}
        />
        {/* {mobileNumber ? (
    <Text style={styles.output}>You entered: {mobileNumber}</Text>
  ) : null} */}
        <Text style={styles.title}>ALTERNATE NUMBER</Text>

        <CustomTextInput
          iconName="phone"
          placeholder="Alternate mobile number"
          keyboardType="phone-pad"
          value={alternateNumber}
          maxLength={13}
          onChangeText={value => setAlternateNumber(value)}
        />
        {/* {mobileNumber ? (
<Text style={styles.output}>You entered: {mobileNumber}</Text>
) : null} */}

        <Text style={styles.title}>EMAIL</Text>

        <CustomTextInput
          iconName="email"
          placeholder="Enter your email"
          value={email}
          onChangeText={value => setEmail(value)}
        />

        {/* <Text style={styles.title}>LAST NAME*</Text>
        <CustomTextInput
          iconName="person"
          placeholder="Last Name"
          value={lastName}
          onChangeText={(value) => setLastName(value)}
        /> */}
        {/* {text ? <Text style={styles.output}>You entered: {text}</Text> : null} */}

        <Text style={styles.title}>PROPERTY TYPE</Text>
        <CustomDropdown
          data={propertyType}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyTypes(item.value);
            }
          }}
          placeholder="Choose an option"
        />

        <Text style={styles.title}>PROPERTY STAGE</Text>
        <CustomDropdown
          data={propertyStage}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyStages(item.value);
            }
          }}
          placeholder="Choose an option"
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
          placeholder="Choose an option"
        />

        <Text style={styles.title}>LOCATION</Text>
        <CustomDropdown
          data={location}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyLocation(item.value);
            }
          }}
          placeholder="Choose an option"
        />
        <Text style={styles.title}>LEADTYPE</Text>
        <CustomDropdown
          data={leadType}
          onSelect={item => {
            {
              setSelectedItem(item);
              setLeadType(item.value);
            }
          }}
          placeholder="Choose an option"
        />
        <Text style={styles.title}>SOURCES</Text>
        <CustomDropdown
          data={sources}
          onSelect={item => {
            {
              setSelectedItem(item);
              setLeadSource(item.value);
            }
          }}
          placeholder="Choose an option"
        />
        <Text style={styles.title}>PROJECTS</Text>
        <CustomDropdown
          data={project}
          onSelect={item => {
            {
              setSelectedItem(item);
              setPropertyProject(item.value);
            }
          }}
          placeholder="Choose an option"
        />
        {/* <Text style={styles.title}>COUNTRY CODE</Text>
        <CountryDropdown
          data={countryData}
          onSelect={(country) => setSelectedCountry(country)}
          placeholder="Select your country"
        /> */}
        {/* {selectedCountry && (
            <Text style={styles.selectedText}>
              Selected: {selectedCountry.name} (+{selectedCountry.code})
            </Text>
          )} */}

        <Text style={styles.title}>CITY</Text>

        <CustomTextInput
          iconName="house"
          placeholder="City"
          value={city}
          onChangeText={value => setCity(value)}
        />
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
});

export default AddContact;
