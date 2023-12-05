import { useState, useEffect } from "react";
import Select from "react-select";
import { AddressProps } from "./type/address.t";
export const AddressInput = (props: AddressProps) => {
  const [address, setAddress] = useState<string>("");
  const [cities, setCities] = useState<any>([]);
  const [wards, setWards] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);

  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [finalAddress, setFinalAddress] = useState("");
  // Function to fetch cities
  const fetchCities = () => {
    fetch(
      "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const cityOptions = Object.values(data).map((city: any) => ({
          label: city.name_with_type,
          value: city.code,
          name: city.name_with_type,
        }));

        setCities(cityOptions);
      })
      .catch((err) => {
        setCities([]);
      });
  };

  // Function to fetch wards based on selected city
  const fetchWards = (cityId: number | string) => {
    if (!cityId) {
      setWards([]);
      return;
    }
    fetch(
      `https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/quan-huyen/${cityId}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        const wardOptions = Object.values(data).map((ward: any) => ({
          label: ward.name_with_type,
          value: ward.code,
          name: ward.path_with_type,
        }));
        setWards(wardOptions);
      })
      .catch((err) => {
        setDistricts([]);
      });
  };

  // Function to fetch districts based on selected ward
  const fetchDistricts = (wardId: number | string) => {
    if (!wardId) {
      setDistricts([]);
      return;
    }
    fetch(
      `https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/xa-phuong/${wardId}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        const districtOptions = Object.values(data).map((district: any) => ({
          label: district.name_with_type,
          value: district.code,
          name: district.path_with_type,
        }));
        setDistricts(districtOptions);
      })
      .catch((err) => {
        setDistricts([]);
      });
  };

  // Load cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Load wards when a city is selected
  useEffect(() => {
    if (selectedCity) {
      setWards([]);
      setSelectedWard(null); // Reset ward when city is changed
      fetchWards(selectedCity.value);
    } else {
      setWards([]); // Reset wards when no city is selected
    }
  }, [selectedCity]);

  // Load districts when a ward is selected
  useEffect(() => {
    if (selectedWard) {
      setDistricts([]);
      setSelectedDistrict(null); // Reset district when ward is changed
      fetchDistricts(selectedWard.value);
    } else {
      setDistricts([]); // Reset districts when no ward is selected
    }
  }, [selectedWard]);
  useEffect(() => {
    if (selectedDistrict) {
      setFinalAddress(address + ", " + selectedDistrict.name);
      props.setAddress(props.var, address + ", " + selectedDistrict.name);
    }
  }, [address, selectedCity, selectedWard, selectedDistrict]);
  return (
    <div>
      <div className="mb-5">
        <div className="flex">
          <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
            {props.name}
          </div>
          <input
            type="text"
            placeholder=""
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input ltr:rounded-l-none rtl:rounded-r-none"
          />
        </div>
      </div>
      <div className="mb-5">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Select
              placeholder="Chọn Tỉnh/Thành phố"
              options={cities}
              onChange={setSelectedCity}
              value={selectedCity}
            />
          </div>
          <div>
            <Select
              placeholder="Chọn Quận/Huyện"
              options={wards}
              onChange={setSelectedWard}
              value={selectedWard}
              isDisabled={!selectedCity} // Disable until a city is selected
            />
          </div>
          <div>
            <Select
              placeholder="Chọn Xã/Phường"
              options={districts}
              isDisabled={!selectedWard}
              onChange={setSelectedDistrict}
              value={selectedDistrict} // Disable until a ward is selected
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <div className="flex">
          <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
            {props.name}
          </div>
          <input
            type="text"
            disabled
            value={finalAddress}
            placeholder=""
            className="form-input ltr:rounded-l-none rtl:rounded-r-none"
          />
        </div>
      </div>
    </div>
  );
};
