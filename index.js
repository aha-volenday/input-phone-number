import React, { Component } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import phone from 'phone';
import InputDate from '@volenday/input-date';
import { Button, Form, Input, Popover } from 'antd';

import './styles.css';

export default class InputPhoneNumber extends Component {
	initialState = { code: 'PH', hasChange: false, isPopoverVisible: false, localValue: '', isFocused: false };
	state = { ...this.initialState, initialState: this.initialState };

	static getDerivedStateFromProps(nextProps, prevState) {
		// Set initial localValue
		if (nextProps.value && !prevState.localValue) {
			return { ...prevState, localValue: nextProps.value };
		}

		// Resets equivalent value
		if (prevState.localValue !== nextProps.value) {
			// For Add
			if (typeof nextProps.value === 'undefined' && !prevState.hasChange && !prevState.isFocused) {
				return { ...prevState.initialState };
			}

			// For Edit
			if (!prevState.isFocused) {
				return { ...prevState.initialState, localValue: nextProps.value };
			}
		}

		return null;
	}

	getPhoneNumber = (value, code) => {
		const mobile = phone(value, code);
		return mobile.length ? mobile[0] : value;
	};

	handleChange = value => {
		const { action } = this.props;

		this.setState({ localValue: value, hasChange: action === 'add' ? false : true });
	};

	handlePopoverVisible = visible => {
		this.setState({ isPopoverVisible: visible });
	};

	renderInput() {
		const { code } = this.state;
		const {
			disabled = false,
			id,
			action,
			label = '',
			onChange,
			placeholder = '',
			required = false,
			styles = {},
			value = ''
		} = this.props;

		return (
			<div class="row">
				<div class="col-md-2 col-sm-2 col-2">
					<CountryDropdown
						classes="form-control"
						disabled={disabled}
						onChange={e =>
							this.setState({ hasChange: action === 'add' ? false : code !== e ? true : false, code: e })
						}
						required={required}
						value={code}
						valueType="short"
					/>
				</div>
				<div class="col-md-10 col-sm-8 col-10">
					<Input
						allowClear
						autoComplete="off"
						disabled={disabled}
						name={id}
						placeholder={placeholder || label || id}
						required={required}
						size="large"
						style={styles}
						type="text"
						onBlur={e => {
							const mobile = this.getPhoneNumber(e.target.value, code);
							if (mobile != value) onChange(id, this.state.localValue);

							this.setState({ isFocused: false });
						}}
						onChange={e => {
							const mobile = this.getPhoneNumber(e.target.value, code);
							if (this.state.localValue != '' && e.target.value == '') onChange(id, mobile);
							this.handleChange(mobile);
						}}
						onFocus={e => {
							this.setState({ isFocused: true });
						}}
						onPressEnter={e => {
							onChange(id, this.getPhoneNumber(e.target.value, code));
							return true;
						}}
						value={this.state.localValue || ''}
					/>
				</div>
			</div>
		);
	}

	renderPopover = () => {
		const { isPopoverVisible } = this.state;
		const { id, label = '', historyTrackValue = '', onHistoryTrackChange } = this.props;

		return (
			<Popover
				content={
					<InputDate
						id={id}
						label={label}
						required={true}
						withTime={true}
						withLabel={true}
						value={historyTrackValue}
						onChange={onHistoryTrackChange}
					/>
				}
				trigger="click"
				title="History Track"
				visible={isPopoverVisible}
				onVisibleChange={this.handlePopoverVisible}>
				<span class="float-right">
					<Button
						type="link"
						shape="circle-outline"
						icon="warning"
						size="small"
						style={{ color: '#ffc107' }}
					/>
				</span>
			</Popover>
		);
	};

	render() {
		const { hasChange } = this.state;
		const { action, historyTrack = false, label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			label: withLabel ? label : false,
			required
		};

		return (
			<Form.Item {...formItemCommonProps}>
				{historyTrack && hasChange && action !== 'add' && this.renderPopover()}
				{this.renderInput()}
			</Form.Item>
		);
	}
}
