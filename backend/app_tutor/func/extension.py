from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def date_calculate(startdate, enddate, weekday, starttime, endtime):
    import datetime
    """
        :type startdate: str
        :type enddate: str
        :type weekday: List[str]
        :type starttime: List[str]
        :type endtime: List[str]
        :rtype class_date: List[List[]]
    """
    week = {
        'monday': 0,    '0': 'monday',
        'tuesday': 1,   '1': 'tuesday',
        'wednesday': 2, '2': 'wednesday',
        'thursday': 3,  '3': 'thursday',
        'friday': 4,    '4': 'friday',
        'saturday': 5,  '5': 'saturday',
        'sunday': 6,    '6': 'sunday'
    }
    startdate = datetime.datetime.strptime(startdate, '%m/%d/%Y')
    enddate = datetime.datetime.strptime(enddate, '%m/%d/%Y')
    period = int((enddate - startdate).days)
    week_lst = [week[item] for item in weekday]
    time_dic = {}
    for i in range(len(weekday)):
        time_dic[weekday[i]] = [starttime[i], endtime[i]]
    actual_date = [[(startdate+datetime.timedelta(i)).strftime('%Y-%m-%d'), week[str((startdate+datetime.timedelta(i)).weekday())], time_dic[week[str((startdate+datetime.timedelta(i)).weekday())]][0], time_dic[week[str((startdate+datetime.timedelta(i)).weekday())]][1]]
                   for i in range(period+1) if (i+startdate.weekday()) % 7 in week_lst]
    return actual_date


def hrs_calculate(starttime, endtime):
    import datetime
    """
        :type startdate: str
        :type enddate: str
        :rtype hrs: float
    """
    starttime = datetime.datetime.strptime(starttime, '%H:%M')
    endtime = datetime.datetime.strptime(endtime, '%H:%M')
    hrs = (endtime - starttime).seconds/3600  # Fix div issue (2021-07-14)
    return hrs


def get_weekday(date):
    import datetime
    """
        :type date: str
        :rtype weekday: str
    """
    week = {
        'MON': 0, '0': 'MON',
        'TUE': 1, '1': 'TUE',
        'WED': 2, '2': 'WED',
        'THU': 3, '3': 'THU',
        'FRI': 4, '4': 'FRI',
        'SAT': 5, '5': 'SAT',
        'SUN': 6, '6': 'SUN'
    }
    date = datetime.datetime.strptime(date, '%Y-%m-%d')
    return week[str(date.weekday())]


def date_type(date):
    import datetime
    """
        :type date: datetime
        :rtype date: str
    """
    return datetime.datetime.strftime(date, '%Y-%m-%d')


def time_type(time):
    import datetime
    """
        :type date: datetime
        :rtype date: str
    """
    return datetime.time.strftime(time, '%H:%M:%S')


def db_weekday_transform(weekday_list):
    """
        :type weekday_list: List[int]
        :rtype weekday_name: List[str]
    """
    week = {
        'MON': 0, '0': 'MON',
        'TUE': 1, '1': 'TUE',
        'WED': 2, '2': 'WED',
        'THU': 3, '3': 'THU',
        'FRI': 4, '4': 'FRI',
        'SAT': 5, '5': 'SAT',
        'SUN': 6, '6': 'SUN'
    }
    weekday_name = []
    for index, day_select in enumerate(weekday_list):
        if day_select:
            weekday_name.append(week[str(index)])
    return weekday_name


def date_type_switch(date):
    import datetime
    """
        :type date: str
        :rtype date: str
    """
    date = datetime.datetime.strptime(date, '%m/%d/%Y')
    return datetime.datetime.strftime(date, '%Y-%m-%d')


def time_type_switch(time):
    import datetime
    """
        :type time: str
        :rtype time: str
    """
    time = datetime.datetime.strptime(time, '%I:%M %p')
    return datetime.datetime.strftime(time, '%H:%M')
