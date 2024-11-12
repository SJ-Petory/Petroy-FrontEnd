import React, { useState, useEffect } from 'react';
import '../../styles/Main/ScheduleModal.css';
import defaultPetPic from '../../assets/DefaultImage.png';
import Calendar from 'react-calendar';  
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ScheduleModal = ({ onClose, pets }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    content: '',
    isRepeating: true,
    noticeYn: false,
    noticeAt: 1,
    priority: 'LOW',
    petId: [],
    selectedDates: [], 
    customRepeat: {
      frequency: 'DAY',
      interval: 1,
      scheduleAt: '',
      endDate: '',
      daysOfWeek: [],
      daysOfMonth: [],
    },
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/schedules/category`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setCategories(response.data.content);
      } catch (error) {
        console.error('카테고리 로딩 중 오류 발생:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const now = new Date();
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const localDateTime = koreanTime.toISOString().slice(0, 16);
    setFormData((prevData) => ({
      ...prevData,
      customRepeat: {
        ...prevData.customRepeat,
        scheduleAt: localDateTime,  
      },
    }));
  }, []);

  useEffect(() => {
    console.log("현재 formData:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // 반복 유무 변경 시 상태 초기화
    if (name === 'isRepeating') {
      setFormData((prevData) => ({
        ...prevData,
        isRepeating: checked,
        customRepeat: checked ? {
          frequency: 'DAY',
          interval: 1,
          scheduleAt: prevData.customRepeat.scheduleAt,
          endDate: '',
          daysOfWeek: [],
          daysOfMonth: [],
        } : prevData.customRepeat,
        selectedDates: !checked ? [] : prevData.selectedDates,
      }));
    } else if (name === 'customRepeat.frequency') {
      setFormData((prevData) => ({
        ...prevData,
        customRepeat: {
          ...prevData.customRepeat,
          frequency: value,
          // frequency 변경 시 daysOfWeek와 daysOfMonth 초기화
          daysOfWeek: value === 'WEEK' ? prevData.customRepeat.daysOfWeek : [],
          daysOfMonth: value === 'MONTH' ? prevData.customRepeat.daysOfMonth : [],
        },
      }));
    } else if (name === 'categoryId') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Number(value),
      }));
    } else if (name.startsWith('customRepeat.')) {
      const [, subKey] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        customRepeat: {
          ...prevData.customRepeat,
          [subKey]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };  

  const handleDayClick = (day) => {
    const updatedDays = formData.customRepeat.daysOfWeek.includes(day)
      ? formData.customRepeat.daysOfWeek.filter((d) => d !== day)
      : [...formData.customRepeat.daysOfWeek, day];
    
    setFormData((prevData) => ({
      ...prevData,
      customRepeat: {
        ...prevData.customRepeat,
        daysOfWeek: updatedDays,
      },
    }));
  };
  
  const handleDayOfMonthClick = (day) => {
    const updatedDays = formData.customRepeat.daysOfMonth.includes(day)
      ? formData.customRepeat.daysOfMonth.filter((d) => d !== day)
      : [...formData.customRepeat.daysOfMonth, day];
  
    setFormData((prevData) => ({
      ...prevData,
      customRepeat: {
        ...prevData.customRepeat,
        daysOfMonth: updatedDays,
      },
    }));
  };

  const handlePetSelectionChange = (petId) => {
    setFormData((prevData) => ({
      ...prevData,
      petId: prevData.petId.includes(petId)
        ? prevData.petId.filter((id) => id !== petId)
        : [...prevData.petId, petId],
    }));
  };

  const handleDateChange = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-CA'); 
    setFormData((prevData) => {
      const existingDate = prevData.selectedDates.find(d => d.date === formattedDate);
      if (existingDate) {
        return {
          ...prevData,
          selectedDates: prevData.selectedDates.filter(d => d.date !== formattedDate),
        };
      } else {
        return {
          ...prevData,
          selectedDates: [...prevData.selectedDates, { date: formattedDate, time: '00:00' }],
        };
      }
    });
  };

  const handleTimeChange = (date, time) => {
    const formattedDate = new Date(date).toLocaleDateString('en-CA');
    const updatedDates = formData.selectedDates.map((d) => {
      if (d.date === formattedDate) {
        return { date: formattedDate, time: time };
      }
      return d;
    });
    setFormData((prevData) => ({
      ...prevData,
      selectedDates: updatedDates,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
  
    const startDateTime = new Date(formData.scheduleAt);
    const endDateTime = new Date(formData.customRepeat.endDate);
    const generatedDates = [];
  
    // 반복 유무에 따라 날짜 생성
    if (formData.isRepeating) {
      if (formData.customRepeat.frequency === 'DAY') {
        // 일일 반복
        for (let date = startDateTime; date <= endDateTime; date.setDate(date.getDate() + formData.customRepeat.interval)) {
          generatedDates.push(date.toLocaleString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }));
        }
      } else if (formData.customRepeat.frequency === 'WEEK') {
        // 주간 반복
        const dayMapping = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
        const selectedDays = Object.keys(dayMapping).filter(day => formData.customRepeat.daysOfWeek.includes(day));
  
        for (let date = startDateTime; date <= endDateTime; date.setDate(date.getDate() + 1)) {
          if (selectedDays.includes(Object.keys(dayMapping)[date.getDay()])) {
            generatedDates.push(date.toLocaleString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }));
            date.setDate(date.getDate() + (formData.customRepeat.interval - 1) * 7);
          }
        }
      } else if (formData.customRepeat.frequency === 'MONTH') {
        // 월간 반복
        const dayOfMonth = formData.customRepeat.daysOfMonth; // 이 부분은 월간에서 사용자가 선택한 날입니다.
        for (let date = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), 1); date <= endDateTime; date.setMonth(date.getMonth() + 1)) {
          dayOfMonth.forEach(day => {
            const monthlyDate = new Date(date.getFullYear(), date.getMonth(), day);
            if (monthlyDate >= startDateTime && monthlyDate <= endDateTime) {
              generatedDates.push(monthlyDate.toLocaleString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }));
            }
          });
        }
      }
    } else {
      // 반복이 없을 때 선택한 날짜 추가
      if (formData.selectedDates && formData.selectedDates.length > 0) {
        formData.selectedDates.forEach(date => {
          const dateObj = new Date(date);
          generatedDates.push(dateObj.toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }));
        });
      }
    }
  
    // 요청 데이터 준비
    const requestData = {
      categoryId: formData.categoryId,
      title: formData.title,
      content: formData.content,
      isRepeating: formData.isRepeating,
      noticeYn: formData.noticeYn,
      priority: formData.priority,
      petId: formData.petId,
    };
  
    // 반복 유무에 따라 customRepeat 또는 selectedDates 추가
    if (formData.isRepeating) {
      requestData.customRepeat = {
        frequency: formData.customRepeat.frequency,
        interval: formData.customRepeat.interval,
        endDate: formData.customRepeat.endDate,
        scheduleAt: formData.customRepeat.scheduleAt,
      };
    } else {
      requestData.selectedDates = generatedDates; // 생성된 날짜를 포함
    }
  
    // 알림 시간은 필수로 포함하지 않음
    if (formData.noticeYn) {
      requestData.noticeAt = formData.noticeAt;
    }
  
    console.log("최종 요청 데이터:", requestData);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/schedules`, requestData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        alert('일정이 생성되었습니다.');
        onClose();
      }
    } catch (error) {
      const { data } = error.response;
      alert(data.errorMessage || '일정 생성 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <div className="schedule-modal-container">
      <div className="schedule-modal-content">
        <h2>일정 생성</h2>
        <form onSubmit={handleSubmit}>
          <label>카테고리
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>제목
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>내용
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          </label>
          <label>반려동물
            <div className="pets-container">
              {pets.map((pet) => (
                <div key={pet.petId} className="pet-card">
                  <img src={pet.imageUrl || defaultPetPic} alt={pet.name} />
                  <div className="pet-info">
                    <input
                      type="checkbox"
                      id={`pet-${pet.petId}`}
                      checked={formData.petId.includes(pet.petId)}
                      onChange={() => handlePetSelectionChange(pet.petId)}
                    />
                    <label htmlFor={`pet-${pet.petId}`}>
                      {pet.name} ({pet.species}, {pet.breed})
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </label>
          <label>반복 유무
            <input
              type="checkbox"
              name="isRepeating"
              checked={formData.isRepeating}
              onChange={handleChange}
            />
          </label>

          {formData.isRepeating ? (
            <>
              <label>반복 주기
              <select
                  name="customRepeat.frequency"
                  value={formData.customRepeat.frequency}
                  onChange={handleChange}
                >
                  <option value="DAY">일일</option>
                  <option value="WEEK">주간</option>
                  <option value="MONTH">월간</option>
                </select>
              </label>
              <label>반복 간격
              <input
                  type="number"
                  name="customRepeat.interval"
                  value={formData.customRepeat.interval}
                  min="1"
                  onChange={handleChange}
                />
              </label>

              {formData.customRepeat.frequency === 'WEEK' && (
                <div className="days-of-week">
                  {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${formData.customRepeat.daysOfWeek.includes(day) ? 'selected' : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              {formData.customRepeat.frequency === 'MONTH' && (
                <div className="days-of-month">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${formData.customRepeat.daysOfMonth.includes(day) ? 'selected' : ''}`}
                      onClick={() => handleDayOfMonthClick(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}  
            <label>일정 반복 시작
            <input
              type="datetime-local"
              name="scheduleAt"
              value={formData.customRepeat.scheduleAt}
              onChange={handleChange}
              required
            />
          </label>
              <label>일정 반복 종료 
                <input
                  type="datetime-local"
                  name="customRepeat.endDate"
                  value={formData.customRepeat.endDate}
                  onChange={handleChange}
                />
              </label>
            </>
          ) : (
            <>
              <label>날짜 선택</label>
              <Calendar
                onChange={handleDateChange}
                value={formData.selectedDates.map((date) => new Date(date))}
                className="custom-small-calendar" 
                tileClassName={({ date }) => 
                  formData.selectedDates.includes(new Date(date).toLocaleDateString('en-CA'))
                    ? 'selected-date'
                    : ''
              }
              selectRange={false}
              />
              <div>
              <label>선택된 날짜</label>
              {formData.selectedDates.length > 0 && (
                <div className="selected-dates">
                  {formData.selectedDates.map((dateObj, index) => (
                    <div key={index} className="date-time-selection">
                     <span>{dateObj.date}</span> 
                     <input
                      type="time"
                      onChange={(e) => handleTimeChange(dateObj.date, e.target.value)}
                    />
                  </div>
                 ))}
                </div>
                )}
              </div>
            </>
          )}

          <label>우선순위
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">낮음</option>
              <option value="MEDIUM">보통</option>
              <option value="HIGH">높음</option>
            </select>
          </label>
          
          <label>알림 설정
            <input
              type="checkbox"
              name="noticeYn"
              checked={formData.noticeYn}
              onChange={handleChange}
            />
          </label>
          {formData.noticeYn && (
            <label>알림 시간 (분 전)
              <input
                type="number"
                name="noticeAt"
                value={formData.noticeAt}
                onChange={handleChange}
                min="1"
                required
              />
            </label>
          )}

          <div className="button-container">
            <button type="submit">저장</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;