import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Main/ScheduleModal.css';
import SchedulePreview from '../../components/Schedule/SchedulePreview.jsx'

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

  useEffect(() => {
    const now = new Date();
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const localDateTime = koreanTime.toISOString().slice(0, 16);
    setFormData((prevData) => ({
      ...prevData,
      scheduleAt: localDateTime,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('customRepeat.')) {
      const [key, subKey] = name.split('.');

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
          daysOfWeek: formData.customRepeat.daysOfWeek,
          daysOfMonth: formData.customRepeat.daysOfMonth,
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
            <input
              type="number"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            />
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
             <label>반려동물
            <select
              name="petId"
              multiple
              value={formData.petId}
              onChange={(e) => setFormData({
                ...formData,
                petId: Array.from(e.target.selectedOptions, option => Number(option.value))
              })}
            >
              {pets.map(pet => (
                <option key={pet.petId} value={pet.petId}>
                  {pet.name} ({pet.species}, {pet.breed})
                </option>
              ))}
            </select>
          </label>
          </label>
          <label>일정 시작 시간
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
                  placeholder="간격"
                  min="1"
                />
                {formData.customRepeat.frequency === 'WEEK' && (
                <div className="day-buttons-container">
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
                <div className="day-buttons-container">
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
                <label>일정 종료 시각
                  <input
                    type="datetime-local"
                    name="customRepeat.endDate"
                    value={formData.customRepeat.endDate}
                    onChange={handleChange}
                  />
                </label>
              </label>
            </>
          )}
          <label>알림 여부
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
              />
            </label>
          )}
          <label>우선순위
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
          <button type="submit" className="schedule-modal-save-button">저장</button>
          <button type="button" onClick={onClose} className="schedule-modal-close-button">닫기</button>
        </form>
      </div>
      <SchedulePreview formData={formData} />
    </div>
  );
};

export default ScheduleModal;
