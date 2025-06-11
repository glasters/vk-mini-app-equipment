import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, SplitCol, SplitLayout, PanelHeaderBack} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import {getAllEquipments} from './../../api/Equipments.js';
import {createContext, useContext, useEffect, useState, useRef} from "react";
import EditEquipmentForm from "./../../components/EditEquipmentForm.js";
import EditApplicationForm from "./../../components/EditApplicationForm.js";
import Table from "./../../components/UserEquipmentTable.js";
import TableApplication from "./../../components/UserApplicationTable.js";
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import './../../assets/css/main.css';
import * as React from 'react';


const headCells = [
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: '',
  },
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: '№',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Категория',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Наименование',
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'Количество',
  },
  {
    id: 'borrow_price',
    numeric: true,
    disablePadding: false,
    label: 'Цена залога',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Цена проката',
  },
  {
    id: 'ingredients',
    numeric: false,
    disablePadding: true,
    label: 'Состав',
  },
];

function createData(id, category, name, quantity, borrowPrice, price, ingredients) {
  var action = 'Edit';
  return {
    action, id, category, name, quantity, borrowPrice, price, ingredients,
  };
}

const rows = [
  createData(1, 'Горное', 'Шнур 16-пряный 6мм', 2, 6.00, 0.00, ''),
  createData(2, 'Общее', 'Палатка "Байкал-4"', 2, 4700, 100.00, 'Чехол палатки, чехол колышков, чехол дуг, дуга длинная 2шт...'),
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const UserEquipments = ({ id, fetchedUser }) => {
  // return (
  //     <label>testsdf</label>
  // );
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dataContext = useContext(createContext(null));
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  const equipments = dataContext?.data?.equipments;
  const [valueCalendar, onChangeCalendar] = useState([]);
  const calendarRef = useRef(null);


  const loadEquipments = async () => {
    try {
      const fetchedEquipments = await getAllEquipments();
      console.log(fetchedEquipments);

      if (!dataContext || !fetchedEquipments) {
        return;
      }

      dataContext.setData({
        ...dataContext.data,
        equipments: fetchedEquipments,
      });
    } catch (e) {
      setError(new Error(JSON.stringify(e)));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (equipments) {
      setLoading(false);
      return;
    }
    // if (!profile || orderInProgress === undefined) {
    //   return;
    // }
    loadEquipments();
  }, [equipments]);

  // useEffect(() => {
  //   if (equipments) {
  //     setLoading(false);
  //     return;
  //   }
  //   if (calendarRef.current) {
  //     // Access the DOM element using myElementRef.current
  //     const element = calendarRef.current;
  //     console.log(element); // Output: <div ref=.../>
  //     // You can now use standard DOM methods like querySelector on this element
  //     const childElement = element.querySelector('[aria-label="June 10, 2025"]');
  //     if (childElement) {
  //       console.log(childElement); // Output: <div class="my-child">
  //       childElement.css.background = 'red !important';
  //       childElement.style.backgroundColor = 'red !important';
  //     }
  //   }
  // }, [equipments]);

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Снаряжение
      </PanelHeader>
      <Group>
        <SplitLayout>
          <SplitCol width={'70%'}>
            <Table/>
          </SplitCol>
          <SplitCol width={'250px'} cs={{'padding-left': '10px'}} ref={calendarRef}>
            <Calendar onChange={onChangeCalendar} value={new Date()} className={['busy-' + getRandomInt(1, 28), 'mbusy-' + getRandomInt(1, 28)]} />
            <table border={1} style={{'width': '100%'}}>
              <thead>
                <tr>
                  <th>Занято</th>
                  <th>Возм. занято</th>
                  <th>Свободно</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <th style={{'background-color': 'red'}}>1</th>
                <th style={{'background-color': 'yellow'}}>1</th>
                <th style={{'background-color': 'white'}}>1</th>
              </tr>
              </tbody>
            </table>
          </SplitCol>
        </SplitLayout>
      </Group>
      <Group header={<Header size="s">Ваша заявка</Header>}>
        <TableApplication/>
        <div style={{'margin': '10px'}}>
          <label>Цена залога: 600.00 руб</label>
        </div>
        <EditApplicationForm />
      </Group>
    </Panel>
  );
};

UserEquipments.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
