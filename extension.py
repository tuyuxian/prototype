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
        'MON': 0, '0': 'MON',
        'TUE': 1, '1': 'TUE',
        'WED': 2, '2': 'WED',
        'THU': 3, '3': 'THU',
        'FRI': 4, '4': 'FRI',
        'SAT': 5, '5': 'SAT',
        'SUN': 6, '6': 'SUN'
    }
    startdate = datetime.datetime.strptime(startdate, '%Y-%m-%d')
    enddate = datetime.datetime.strptime(enddate, '%Y-%m-%d')
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
    starttime = datetime.datetime.strptime(starttime, '%H:%M:%S')
    endtime = datetime.datetime.strptime(endtime, '%H:%M:%S')
    hrs = divmod((endtime - starttime).total_seconds(), 3600)[0]
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
    return datetime.time.strftime(time,  '%H:%M:%S')

