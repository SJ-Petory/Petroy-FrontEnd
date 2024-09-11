import React, { useState, useEffect } from 'react';
import '../../styles/Main/ScheduleModal.css';
import SchedulePreview from '../../components/Schedule/SchedulePreview.jsx';
import defaultPetPic from '../../assets/DefaultImage.png';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ScheduleModal = ({ onClose, pets }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    content: '',
    scheduleAt: '',
    repeatType: 'BASIC',
    repeatCycle: 'DAILY',
    noticeYn: false,
    noticeAt: 1,
    priority: 'LOW',
    petId: [],
    customRepeat: {
      frequency: 'DAY',
      interval: 1,
      endDate: '',
      daysOfWeek: [],
      daysOfMonth: [],
    }
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
        setCategories(response.data); 
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
    setFormData(prevData => ({
      ...prevData,
      scheduleAt: localDateTime,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('customRepeat.')) {
      const [, subKey] = name.split('.');

      setFormData(prevData => ({
        ...prevData,
        customRepeat: {
          ...prevData.customRepeat,
          [subKey]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleDayClick = (day) => {
    setFormData(prevData => ({
      ...prevData,
      customRepeat: {
        ...prevData.customRepeat,
        daysOfWeek: prevData.customRepeat.daysOfWeek.includes(day)
          ? prevData.customRepeat.daysOfWeek.filter(d => d !== day)
          : [...prevData.customRepeat.daysOfWeek, day]
      }
    }));
  };

  const handleDayOfMonthClick = (day) => {
    setFormData(prevData => ({
      ...prevData,
      customRepeat: {
        ...prevData.customRepeat,
        daysOfMonth: prevData.customRepeat.daysOfMonth.includes(day)
          ? prevData.customRepeat.daysOfMonth.filter(d => d !== day)
          : [...prevData.customRepeat.daysOfMonth, day]
      }
    }));
  };

  const handlePetSelectionChange = (petId) => {
    setFormData(prevData => ({
      ...prevData,
      petId: prevData.petId.includes(petId)
        ? prevData.petId.filter(id => id !== petId)
        : [...prevData.petId, petId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');

    const requestData = {
      categoryId: formData.categoryId,
      title: formData.title,
      content: formData.content,
      scheduleAt: formData.scheduleAt,
      repeatType: formData.repeatType,
      ...(formData.repeatType === 'BASIC' && { repeatCycle: formData.repeatCycle }),
      ...(formData.repeatType === 'CUSTOM' && { 
        customRepeat: {
          ...formData.customRepeat,
          daysOfWeek: formData.customRepeat.frequency === 'WEEK' ? formData.customRepeat.daysOfWeek : undefined, 
          daysOfMonth: formData.customRepeat.frequency === 'MONTH' ? formData.customRepeat.daysOfMonth : undefined, 
        }
      }),
      noticeYn: formData.noticeYn,
      noticeAt: formData.noticeAt,
      priority: formData.priority,
      petId: formData.petId, 
    };

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
              {categories.map(category => (
                <option key={category.id} value={category.id}>
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
            {pets.map(pet => (
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
          <label>일정 시작
            <input
              type="datetime-local"
              name="scheduleAt"
              value={formData.scheduleAt}
              onChange={handleChange}
              required
            />
          </label>
          <label>반복 유형
            <select
              name="repeatType"
              value={formData.repeatType}
              onChange={handleChange}
            >
              <option value="BASIC">기본</option>
              <option value="CUSTOM">커스텀</option>
            </select>
          </label>
          {formData.repeatType === 'BASIC' && (
            <label>반복 주기
              <select
                name="repeatCycle"
                value={formData.repeatCycle}
                onChange={handleChange}
              >
                <option value="DAILY">매일</option>
                <option value="WEEKLY">매주</option>
                <option value="MONTHLY">매월</option>
              </select>
            </label>
          )}
          {formData.repeatType === 'CUSTOM' && (
            <>
              <label>커스텀 반복 주기
                <select
                  name="customRepeat.frequency"
                  value={formData.customRepeat.frequency}
                  onChange={handleChange}
                >
                  <option value="DAY">일일</option>
                  <option value="WEEK">주간</option>
                  <option value="MONTH">월간</option>
                  <option value="YEAR">연간</option>
                </select>
                <input
                  type="number"
                  name="customRepeat.interval"
                  value={formData.customRepeat.interval}
                  onChange={handleChange}
                  min="1"
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
              {formData.customRepeat.frequency === 'YEAR' && (
                <label>
                  종료일
                  <input
                    type="date"
                    name="customRepeat.endDate"
                    value={formData.customRepeat.endDate}
                    onChange={handleChange}
                  />
                </label>
              )}
            </>
          )}
          <label>
            알림 설정
            <input
              type="checkbox"
              name="noticeYn"
              checked={formData.noticeYn}
              onChange={handleChange}
            />
          </label>
          <label>
            알림 시간 (분)
            <input
              type="number"
              name="noticeAt"
              value={formData.noticeAt}
              onChange={handleChange}
              min="0"
            />
          </label>
          <label>
            우선순위
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">낮음</option>
              <option value="MEDIUM">중간</option>
              <option value="HIGH">높음</option>
            </select>
          </label>
          <button type="submit">일정 저장</button>
          <button type="button" onClick={onClose}>닫기</button>
        </form>
      </div>
      <SchedulePreview formData={formData} />
    </div>
  );
};

export default ScheduleModal;
